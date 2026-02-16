import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Runtime "mo:core/Runtime";

actor {
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
    industryGrowth : Float;
    profitability : Float;
    riskDiscount : Float;
    adjustedValuation : Float;
  };

  public func processDcf(inputs : DcfInputs) : async DcfOutputs {
    // Step 1: Validate Inputs
    validateInputs(inputs);

    // Step 2: Calculate Growth and Discount Factors
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

    // Calculate Industry Growth (DD) = if (CC > 0) CC else 0
    let aa = (inputs.revenueLastQuarter * 4) - inputs.revenueLastYear; // revenue growth of last 4 quarters as input for growth calculation
    let bb = aa * 100 / inputs.revenueLastYear; // calculate % "normalized growth"/ YoY growth
    let cc = bb / 2; // divide this by 2 to reflect that this relative growth rate will slow down and eventually resemble the standard GDP
    let dd = if (cc > 0) { cc } else { 0.0 };
    let industryGrowth = dd / 100; // Convert to percentage

    let profitability = 0.15;
    let riskDiscount = 1.05;
    let adjustedValuation = industryGrowth * profitability / riskDiscount;

    {
      totalShares = inputs.sharesOutstanding;
      totalMarketCap;
      intrinsicPricePerShare = totalMarketCap / inputs.sharesOutstanding;
      actualPerShare = inputs.actualSharePrice; // Use provided actual share price
      industryGrowth;
      profitability;
      riskDiscount;
      adjustedValuation;
    };
  };

  func calculatePresentValueTerminal(
    terminalValue : Float,
    discountRate : Float,
    discountPower : Float,
  ) : Float {
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
      Runtime.trap("Shares outstanding must be a positive number. {\"code\":40}");
    };
    if (inputs.forecastedFCF <= 0) {
      Runtime.trap("Forecasted FCF must be a positive number. {\"code\":41}");
    };
    if (inputs.terminalYears <= 0) {
      Runtime.trap("Terminal years must be a positive number. {\"code\":42}");
    };
    if (inputs.perpetualGrowthRate < 0 or inputs.perpetualGrowthRate >= 1) {
      Runtime.trap("Perpetual growth rate percentage must be between 0 and 1 (exclusive). {\"code\":43}");
    };
    if (inputs.weightedAveCostOfCapital <= 0 or inputs.weightedAveCostOfCapital > 1) {
      Runtime.trap("Weighted average cost of capital must be above 0 and at most 1. {\"code\":44}");
    };
    if (inputs.actualSharePrice <= 0) {
      Runtime.trap("Actual share price must be a positive number. {\"code\":45}");
    };
  };
};
