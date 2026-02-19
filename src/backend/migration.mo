import Map "mo:core/Map";

module {
  type OldUserProfile = {
    mobileNumber : Text;
    firstName : Text;
    lastName : Text;
  };

  type OldDcfInputs = {
    sharesOutstanding : Float;
    forecastedFCF : Float;
    perpetualGrowthRate : Float;
    weightedAveCostOfCapital : Float;
    terminalYears : Int;
    actualSharePrice : Float;
    revenueLastQuarter : Float;
    revenueLastYear : Float;
    industryGrowthPercent : Float;
  };

  type OldDcfOutputs = {
    totalShares : Float;
    totalMarketCap : Float;
    intrinsicPricePerShare : Float;
    actualPerShare : Float;
    profitability : Float;
    riskDiscount : Float;
    adjustedValuation : Float;
  };

  // Old actor type
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    // No changes needed for userProfiles as the type remains unchanged
    { userProfiles = old.userProfiles };
  };
};
