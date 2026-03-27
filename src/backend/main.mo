import Float "mo:core/Float";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";



actor {
  // User Profile Types
  public type UserProfile = {
    mobileNumber : Text;
    firstName : Text;
    lastName : Text;
  };

  // Visitor Details (no login required)
  public type VisitorDetails = {
    id : Nat;
    name : Text;
    email : Text;
    mobile : Text;
    timestamp : Int;
  };

  // Contact Message Types
  public type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  // DCF Calculation Types
  type DcfInputs = {
    sharesOutstanding : Float;
    forecastedFCF : Float;
    perpetualGrowthRate : Float;
    weightedAveCostOfCapital : Float;
    terminalYears : Int;
    actualSharePrice : Float;
    revenueLastQuarter : Float;
    revenueLastYear : Float;
  };

  type DcfOutputs = {
    totalShares : Float;
    totalMarketCap : Float;
    intrinsicPricePerShare : Float;
    actualPerShare : Float;
    profitability : Float;
    riskDiscount : Float;
    adjustedValuation : Float;
  };

  // Storage - stable so data persists across upgrades/redeployments
  stable var contactMessages = Map.empty<Nat, ContactMessage>();
  stable var lastMessageId = 0;

  stable var visitorDetails = Map.empty<Nat, VisitorDetails>();
  stable var lastVisitorId = 0;

  stable var userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Bootstrap: assign the owner's principal as admin
  let ownerPrincipal = Principal.fromText("h5jag-iyh7k-ejbeh-phjli-5yywu-svez3-vzqsp-2jaln-zohyd-jbdqp-7qe");
  accessControlState.userRoles.add(ownerPrincipal, #admin);
  accessControlState.adminAssigned := true;

  // Admin PIN for PIN-based access
  let ADMIN_PIN : Text = "INTRI2024";

  // Visitor Details APIs (no auth required)
  public shared func submitVisitorDetails(name : Text, email : Text, mobile : Text) : async () {
    lastVisitorId += 1;
    let entry : VisitorDetails = {
      id = lastVisitorId;
      name;
      email;
      mobile;
      timestamp = Time.now();
    };
    visitorDetails.add(lastVisitorId, entry);
  };

  public query ({ caller }) func getAllVisitorDetails() : async [VisitorDetails] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can fetch visitor details");
    };
    visitorDetails.values().toArray();
  };

  public shared func getAllVisitorDetailsWithPin(pin : Text) : async [VisitorDetails] {
    if (pin != ADMIN_PIN) {
      Runtime.trap("Invalid admin PIN");
    };
    visitorDetails.values().toArray();
  };

  public shared func getAllContactMessagesWithPin(pin : Text) : async [ContactMessage] {
    if (pin != ADMIN_PIN) {
      Runtime.trap("Invalid admin PIN");
    };
    contactMessages.values().toArray();
  };

  // User Profile APIs
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch their profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can fetch all profiles");
    };
    userProfiles.toArray();
  };

  public query ({ caller }) func getNumAllUserProfiles() : async ?Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile count");
    };
    ?userProfiles.size();
  };

  // Contact Message APIs
  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async () {
    lastMessageId += 1;

    let contactMessage : ContactMessage = {
      id = lastMessageId;
      name;
      email;
      message;
      timestamp = Time.now();
    };

    contactMessages.add(lastMessageId, contactMessage);
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can fetch all contact messages");
    };
    contactMessages.values().toArray();
  };

  // DCF Calculation Helper Functions
  func calculatePresentValueTerminal(terminalValue : Float, discountRate : Float, discountPower : Float) : Float {
    terminalValue / (discountRate ** discountPower);
  };

  func calculateTotalAnnualPV(inputs : DcfInputs, discountRate : Float) : Float {
    var totalAnnualPV : Float = 0.0;
    var year : Int = 0;

    while (year < inputs.terminalYears) {
      let yearFloat = year.toFloat();
      let annualFCF = inputs.forecastedFCF * (inputs.sharesOutstanding + 1);
      let discountedFCF = annualFCF / (discountRate ** yearFloat);
      totalAnnualPV += discountedFCF;
      year += 1;
    };
    totalAnnualPV;
  };

  func validateInputs(inputs : DcfInputs) {
    if (inputs.sharesOutstanding <= 0) {
      Runtime.trap(
        "Shares outstanding must be a positive number. {\"code\":40}",
      );
    };
    if (inputs.forecastedFCF <= 0) {
      Runtime.trap(
        "Forecasted FCF must be a positive number. {\"code\":41}",
      );
    };
    if (inputs.terminalYears <= 0) {
      Runtime.trap(
        "Terminal years must be a positive number. {\"code\":42}",
      );
    };
    if (
      inputs.perpetualGrowthRate < 0 or inputs.perpetualGrowthRate >= 1
    ) {
      Runtime.trap(
        "Perpetual growth rate percentage must be between 0 and 1 (exclusive). {\"code\":43}",
      );
    };
    if (
      inputs.weightedAveCostOfCapital <= 0 or inputs.weightedAveCostOfCapital > 1
    ) {
      Runtime.trap(
        "Weighted average cost of capital must be above 0 and at most 1. {\"code\":44}",
      );
    };
    if (inputs.actualSharePrice <= 0) {
      Runtime.trap(
        "Actual share price must be a positive number. {\"code\":45}",
      );
    };
  };

  // DCF Calculation API
  public query ({ caller }) func processDcf(inputs : DcfInputs) : async DcfOutputs {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform DCF calculations");
    };

    validateInputs(inputs);

    let discountRate = 1.0 + inputs.weightedAveCostOfCapital;
    let growthRate = 1.0 + inputs.perpetualGrowthRate;
    let netRate = discountRate - growthRate;

    let terminalValue = inputs.forecastedFCF * (inputs.sharesOutstanding + 1) * growthRate / netRate;
    let presentValueTerminal = calculatePresentValueTerminal(
      terminalValue,
      discountRate,
      inputs.terminalYears.toNat().toFloat(),
    );

    let totalAnnualPV = calculateTotalAnnualPV(inputs, discountRate);
    let totalMarketCap = totalAnnualPV + presentValueTerminal;

    let profitability = 0.15;
    let riskDiscount = 1.05;
    let adjustedValuation = 0.0;

    {
      totalShares = inputs.sharesOutstanding;
      totalMarketCap;
      intrinsicPricePerShare = totalMarketCap / inputs.sharesOutstanding;
      actualPerShare = inputs.actualSharePrice;
      profitability;
      riskDiscount;
      adjustedValuation;
    };
  };
};
