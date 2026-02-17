import { DcfInputs } from './presets';

const REPO_RATE = 5.5;

/**
 * Safe numeric helper - returns 0 for NaN, Infinity, or undefined
 */
function safeNum(value: number): number {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
    return 0;
  }
  return value;
}

/**
 * Safe division helper
 */
function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0 || !isFinite(denominator)) {
    return 0;
  }
  const result = numerator / denominator;
  return safeNum(result);
}

/**
 * Formula definition with expression and computed value
 */
export interface FormulaDefinition {
  name: string;
  expression: string;
  value: number;
  description?: string;
}

/**
 * Complete registry of all formulas used in the Company Snapshot Tool
 */
export interface FormulasRegistry {
  // Primary calculations
  totalShares: FormulaDefinition;
  bookValue: FormulaDefinition;
  initialGrowth: FormulaDefinition;
  industryGrowth: FormulaDefinition;
  
  // Intermediate formulas (B-Q)
  B: FormulaDefinition;
  C: FormulaDefinition;
  D: FormulaDefinition;
  E: FormulaDefinition;
  F: FormulaDefinition;
  G: FormulaDefinition;
  H: FormulaDefinition;
  K: FormulaDefinition;
  L: FormulaDefinition;
  M: FormulaDefinition;
  N: FormulaDefinition;
  O: FormulaDefinition;
  P: FormulaDefinition;
  Q: FormulaDefinition;
  
  // Capital return calculations
  initialCapitalReturnYearly: FormulaDefinition;
  initialCapitalReturnQuarterly: FormulaDefinition;
  initialAverageCapitalReturn: FormulaDefinition;
  initialCapitalReturnPlusAsset: FormulaDefinition;
  
  // Final outputs
  totalMarketCap: FormulaDefinition;
  intrinsicPrice: FormulaDefinition;
  actualValue: FormulaDefinition;
}

/**
 * Calculate all formulas and return a complete registry
 * This is the single source of truth for all Company Snapshot calculations
 */
export function calculateAllFormulas(inputs: DcfInputs): FormulasRegistry {
  const {
    marketCap,
    ltp,
    pbRatio,
    revenueLastYear,
    netProfitLastYear,
    revenueLastQuarter,
    netProfitLastQuarter,
    publicHolding,
    promoterPledgeQuantity,
    resultUpdatedSince6Years,
    psuOrNot,
    netNpaNbfc,
    industryGrowthPercent,
  } = inputs;

  // Total Shares = Market cap / LTP
  const totalSharesValue = safeDivide(safeNum(marketCap), safeNum(ltp));
  const totalShares: FormulaDefinition = {
    name: 'Total Shares',
    expression: 'Market cap ÷ LTP',
    value: totalSharesValue,
    description: 'Total number of shares outstanding',
  };

  // Book Value = LTP / PB Ratio × Total Shares
  const bookValueValue = safeDivide(safeNum(ltp), safeNum(pbRatio)) * totalSharesValue;
  const bookValue: FormulaDefinition = {
    name: 'Book Value',
    expression: 'LTP ÷ PB Ratio × Total Shares',
    value: bookValueValue,
    description: 'Total book value of the company',
  };

  // Initial Growth = (Revenue last quarter × 4) - Revenue last year
  const initialGrowthValue = safeNum(revenueLastQuarter) * 4 - safeNum(revenueLastYear);
  const initialGrowth: FormulaDefinition = {
    name: 'Initial Growth',
    expression: '(Revenue last quarter × 4) - Revenue last year',
    value: initialGrowthValue,
    description: 'Annualized quarterly revenue growth',
  };

  // Industry Growth = Market cap × Industry Growth % ÷ 100
  const industryGrowthValue = safeNum(marketCap) * safeNum(industryGrowthPercent) / 100;
  const industryGrowth: FormulaDefinition = {
    name: 'Industry Growth',
    expression: 'Market cap × Industry Growth % ÷ 100',
    value: industryGrowthValue,
    description: 'Industry-adjusted growth value',
  };

  // B = Revenue last year ÷ Market cap
  const BValue = safeDivide(safeNum(revenueLastYear), safeNum(marketCap));
  const B: FormulaDefinition = {
    name: 'B',
    expression: 'Revenue last year ÷ Market cap',
    value: BValue,
    description: 'Revenue to market cap ratio',
  };

  // C = NET PROFIT yearly ÷ Market cap × 100
  const CValue = safeDivide(safeNum(netProfitLastYear), safeNum(marketCap)) * 100;
  const C: FormulaDefinition = {
    name: 'C',
    expression: 'NET PROFIT yearly ÷ Market cap × 100',
    value: CValue,
    description: 'Profit margin percentage',
  };

  // D = NET PROFIT yearly (always returns netProfitLastYear)
  const DValue = safeNum(netProfitLastYear);
  const D: FormulaDefinition = {
    name: 'D',
    expression: 'NET PROFIT yearly',
    value: DValue,
    description: 'Annual net profit',
  };

  // E = Revenue last quarter ÷ Market cap × 4
  const EValue = safeDivide(safeNum(revenueLastQuarter), safeNum(marketCap)) * 4;
  const E: FormulaDefinition = {
    name: 'E',
    expression: 'Revenue last quarter ÷ Market cap × 4',
    value: EValue,
    description: 'Annualized quarterly revenue ratio',
  };

  // F = NET PROFIT quarterly ÷ Market cap × 400
  const FValue = safeDivide(safeNum(netProfitLastQuarter), safeNum(marketCap)) * 400;
  const F: FormulaDefinition = {
    name: 'F',
    expression: 'NET PROFIT quarterly ÷ Market cap × 400',
    value: FValue,
    description: 'Annualized quarterly profit ratio',
  };

  // G = If(NET PROFIT quarterly > 0, NET PROFIT quarterly, 0)
  const GValue = netProfitLastQuarter > 0 ? safeNum(netProfitLastQuarter) : 0;
  const G: FormulaDefinition = {
    name: 'G',
    expression: 'If(NET PROFIT quarterly > 0, NET PROFIT quarterly, 0)',
    value: GValue,
    description: 'Positive quarterly profit only',
  };

  // H = Initial Growth × 100 ÷ Revenue last year
  const HValue = safeDivide(safeNum(initialGrowthValue) * 100, safeNum(revenueLastYear));
  const H: FormulaDefinition = {
    name: 'H',
    expression: 'Initial Growth × 100 ÷ Revenue last year',
    value: HValue,
    description: 'Growth rate percentage',
  };

  // K = 50 - Public holding (convert from decimal to percentage)
  const KValue = 50 - safeNum(publicHolding) * 100;
  const K: FormulaDefinition = {
    name: 'K',
    expression: '50 - Public holding %',
    value: KValue,
    description: 'Adjusted public holding factor',
  };

  // L = 1 + (K ÷ 100)
  const LValue = 1 + safeNum(KValue) / 100;
  const L: FormulaDefinition = {
    name: 'L',
    expression: '1 + (K ÷ 100)',
    value: LValue,
    description: 'Public holding multiplier',
  };

  // M = If(Result updated since 6 years = yes, 1, 0.5)
  const MValue = resultUpdatedSince6Years ? 1 : 0.5;
  const M: FormulaDefinition = {
    name: 'M',
    expression: 'If(Result updated since 6 years = yes, 1, 0.5)',
    value: MValue,
    description: 'Result recency factor',
  };

  // N = If(PSU or not = yes, 0.8, 1)
  const NValue = psuOrNot ? 0.8 : 1;
  const N: FormulaDefinition = {
    name: 'N',
    expression: 'If(PSU or not = yes, 0.8, 1)',
    value: NValue,
    description: 'PSU adjustment factor',
  };

  // O = NET NPA × 10 (convert from decimal to percentage first)
  const OValue = safeNum(netNpaNbfc) * 100 * 10;
  const O: FormulaDefinition = {
    name: 'O',
    expression: 'NET NPA % × 10',
    value: OValue,
    description: 'NPA impact factor',
  };

  // P = (100 - O) ÷ 100
  const PValue = (100 - safeNum(OValue)) / 100;
  const P: FormulaDefinition = {
    name: 'P',
    expression: '(100 - O) ÷ 100',
    value: PValue,
    description: 'NPA adjustment multiplier',
  };

  // Q = (100 - Promoter pledge quantity %) ÷ 100
  const QValue = (100 - safeNum(promoterPledgeQuantity) * 100) / 100;
  const Q: FormulaDefinition = {
    name: 'Q',
    expression: '(100 - Promoter pledge quantity %) ÷ 100',
    value: QValue,
    description: 'Pledge adjustment multiplier',
  };

  // Initial Capital Return Yearly = D × 100 ÷ Repo Rate
  const initialCapitalReturnYearlyValue = safeDivide(safeNum(DValue) * 100, REPO_RATE);
  const initialCapitalReturnYearly: FormulaDefinition = {
    name: 'Initial Capital Return Yearly',
    expression: 'D × 100 ÷ Repo Rate',
    value: initialCapitalReturnYearlyValue,
    description: 'Yearly capital return based on profit',
  };

  // Initial Capital Return Quarterly = G × 400 ÷ Repo Rate
  const initialCapitalReturnQuarterlyValue = safeDivide(safeNum(GValue) * 400, REPO_RATE);
  const initialCapitalReturnQuarterly: FormulaDefinition = {
    name: 'Initial Capital Return Quarterly',
    expression: 'G × 400 ÷ Repo Rate',
    value: initialCapitalReturnQuarterlyValue,
    description: 'Quarterly capital return annualized',
  };

  // Initial Average Capital Return = (Initial Capital Return Yearly + Initial Capital Return Quarterly) ÷ 2
  const initialAverageCapitalReturnValue =
    (safeNum(initialCapitalReturnYearlyValue) + safeNum(initialCapitalReturnQuarterlyValue)) / 2;
  const initialAverageCapitalReturn: FormulaDefinition = {
    name: 'Initial Average Capital Return',
    expression: '(Initial Capital Return Yearly + Initial Capital Return Quarterly) ÷ 2',
    value: initialAverageCapitalReturnValue,
    description: 'Average of yearly and quarterly returns',
  };

  // Initial Capital Return + Asset = Initial Average Capital Return + Book Value
  const initialCapitalReturnPlusAssetValue =
    safeNum(initialAverageCapitalReturnValue) + safeNum(bookValueValue);
  const initialCapitalReturnPlusAsset: FormulaDefinition = {
    name: 'Initial Capital Return + Asset',
    expression: 'Initial Average Capital Return + Book Value',
    value: initialCapitalReturnPlusAssetValue,
    description: 'Total capital plus assets',
  };

  // Total Market Cap = (Initial Capital + Asset) × L × Q × M × N × P
  const totalMarketCapValue =
    safeNum(initialCapitalReturnPlusAssetValue) *
    safeNum(LValue) *
    safeNum(QValue) *
    safeNum(MValue) *
    safeNum(NValue) *
    safeNum(PValue);
  const totalMarketCap: FormulaDefinition = {
    name: 'Total Market Cap',
    expression: '(Initial Capital + Asset) × L × Q × M × N × P',
    value: totalMarketCapValue,
    description: 'Adjusted total market capitalization',
  };

  // Intrinsic Price = Total Market Cap ÷ Total Shares
  const intrinsicPriceValue = safeDivide(totalMarketCapValue, totalSharesValue);
  const intrinsicPrice: FormulaDefinition = {
    name: 'Intrinsic Price',
    expression: 'Total Market Cap ÷ Total Shares',
    value: intrinsicPriceValue,
    description: 'Intrinsic price per share',
  };

  // Actual Value = (Initial Capital + Asset) ÷ Total Shares
  const actualValueValue = safeDivide(initialCapitalReturnPlusAssetValue, totalSharesValue);
  const actualValue: FormulaDefinition = {
    name: 'Actual Value',
    expression: '(Initial Capital + Asset) ÷ Total Shares',
    value: actualValueValue,
    description: 'Actual value per share',
  };

  return {
    totalShares,
    bookValue,
    initialGrowth,
    industryGrowth,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    initialCapitalReturnYearly,
    initialCapitalReturnQuarterly,
    initialAverageCapitalReturn,
    initialCapitalReturnPlusAsset,
    totalMarketCap,
    intrinsicPrice,
    actualValue,
  };
}

/**
 * Get all formulas as an ordered array for display purposes
 */
export function getFormulasArray(inputs: DcfInputs): FormulaDefinition[] {
  const registry = calculateAllFormulas(inputs);
  
  return [
    registry.totalShares,
    registry.bookValue,
    registry.initialGrowth,
    registry.industryGrowth,
    registry.B,
    registry.C,
    registry.D,
    registry.E,
    registry.F,
    registry.G,
    registry.H,
    registry.K,
    registry.L,
    registry.M,
    registry.N,
    registry.O,
    registry.P,
    registry.Q,
    registry.initialCapitalReturnYearly,
    registry.initialCapitalReturnQuarterly,
    registry.initialAverageCapitalReturn,
    registry.initialCapitalReturnPlusAsset,
    registry.totalMarketCap,
    registry.intrinsicPrice,
    registry.actualValue,
  ];
}
