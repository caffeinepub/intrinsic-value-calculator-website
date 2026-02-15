import Int "mo:core/Int";
import Float "mo:core/Float";
import Nat64 "mo:core/Nat64";
import Runtime "mo:core/Runtime";

actor {
  type DcfInputs = {
    sharesOutstanding : Float;
    forecastedFCF : Float;
    perpetualGrowthRate : Float;
    weightedAveCostOfCapital : Float;
    terminalYears : Int;
  };

  type DcfOutputs = {
    totalShares : Float;
    totalMarketCap : Float;
    intrinsicPricePerShare : Float;
    actualPerShare : Float;
  };

  public func processDcf(_inputs : DcfInputs) : async DcfOutputs {
    // Step 1: Validate Inputs
    if (_inputs.sharesOutstanding <= 0) {
      Runtime.trap("Shares outstanding must be a positive number.");
    };
    if (_inputs.forecastedFCF <= 0) {
      Runtime.trap("Forecasted FCF must be a positive number.");
    };
    if (_inputs.terminalYears <= 0) {
      Runtime.trap("Terminal years must be a positive number.");
    };
    if (_inputs.perpetualGrowthRate < 0 or _inputs.perpetualGrowthRate >= 1) {
      Runtime.trap("Perpetual growth rate percentage must be between 0 and 1 (exclusive).");
    };
    if (_inputs.weightedAveCostOfCapital <= 0 or _inputs.weightedAveCostOfCapital > 1) {
      Runtime.trap("Weighted average cost of capital must be above 0 and at most 1.");
    };

    // Step 2: Calculate Growth and Discount Factors
    let discountRate = 1.0 + _inputs.weightedAveCostOfCapital;
    let growthRate = 1.0 + _inputs.perpetualGrowthRate;
    let netRate = discountRate - growthRate;

    if (netRate <= 0) {
      Runtime.trap("Weighted average cost of capital (WACC) must be greater than the perpetual growth rate.");
    };

    // Step 3: Calculate Terminal Value
    let terminalValue = _inputs.forecastedFCF * (_inputs.sharesOutstanding + 1) * growthRate / netRate;

    // Step 4: Discount Terminal Value to Present
    let terminalYearsNat = _inputs.terminalYears.toNat();
    let discountPower = terminalYearsNat.toFloat();
    let presentValueTerminal = terminalValue / (discountRate ** discountPower);

    // Step 5: Calculate Annual Cash Flows (PV)
    var totalAnnualPV : Float = 0.0;
    var year = 0;
    while (year < _inputs.terminalYears) {
      let annualFCF = _inputs.forecastedFCF * (_inputs.sharesOutstanding + 1);
      let discountYearPower = year.toFloat();
      let discountedFCF = annualFCF / (discountRate ** discountYearPower);
      totalAnnualPV += discountedFCF;
      year += 1;
    };

    // Step 6: Compute Total Market Cap
    let totalMarketCap = totalAnnualPV + presentValueTerminal;

    {
      totalShares = _inputs.sharesOutstanding;
      totalMarketCap;
      intrinsicPricePerShare = totalMarketCap / _inputs.sharesOutstanding;
      actualPerShare = 0.0;
    };
  };
};
