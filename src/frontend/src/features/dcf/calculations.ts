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

export interface HiddenCalculations {
  totalShares: number;
  bookValue: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  K: number;
  L: number;
  M: number;
  N: number;
  O: number;
  P: number;
  Q: number;
  initialCapitalReturnYearly: number;
  initialCapitalReturnQuarterly: number;
  initialAverageCapitalReturn: number;
  initialCapitalReturnPlusAsset: number;
  totalMarketCap: number;
  // Industry Growth calculations
  AA: number;
  BB: number;
  CC: number;
  DD: number;
}

/**
 * Calculate all hidden values based on the Excel formulas provided
 */
export function calculateHiddenValues(inputs: DcfInputs): HiddenCalculations {
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
  } = inputs;

  // Total shares = Market cap / ltp
  const totalShares = safeDivide(safeNum(marketCap), safeNum(ltp));

  // Book Value = ltp / PB RATIO * (Total shares)
  const bookValue = safeDivide(safeNum(ltp), safeNum(pbRatio)) * safeNum(totalShares);

  // B = revenue last year / Market cap
  const B = safeDivide(safeNum(revenueLastYear), safeNum(marketCap));

  // C = NET PROFIT yearly / Market cap * (100)
  const C = safeDivide(safeNum(netProfitLastYear), safeNum(marketCap)) * 100;

  // D = If(NET PROFIT yearly>0, NET PROFIT, NET PROFIT yearly)
  // Note: This always returns netProfitLastYear
  const D = safeNum(netProfitLastYear);

  // E = Revenue last quarter / Market cap * (4)
  const E = safeDivide(safeNum(revenueLastQuarter), safeNum(marketCap)) * 4;

  // F = NET PROFIT quarterly / Market cap * (400)
  const F = safeDivide(safeNum(netProfitLastQuarter), safeNum(marketCap)) * 400;

  // G = If(NET PROFIT quarterly>0, NET PROFIT quarterly, 0)
  const G = netProfitLastQuarter > 0 ? safeNum(netProfitLastQuarter) : 0;

  // Industry Growth calculations
  // AA = (Revenue last quarter * 4) - Revenue last year
  const AA = safeNum(revenueLastQuarter) * 4 - safeNum(revenueLastYear);

  // BB = AA * 100 / Revenue last year
  const BB = safeDivide(safeNum(AA) * 100, safeNum(revenueLastYear));

  // CC = BB / 2
  const CC = safeNum(BB) / 2;

  // DD = IF(CC > 0, CC, 0)
  const DD = CC > 0 ? safeNum(CC) : 0;

  // K = 50 - public holding (convert from decimal to percentage)
  const K = 50 - safeNum(publicHolding) * 100;

  // L = 1 + (k / 100)
  const L = 1 + safeNum(K) / 100;

  // M = if(result updated till 6 months="yes", 1, 0.5)
  const M = resultUpdatedSince6Years ? 1 : 0.5;

  // N = if(PSU OR not="yes", 0.8, 1)
  const N = psuOrNot ? 0.8 : 1;

  // O = NET NPA * 10 (convert from decimal to percentage first)
  const O = safeNum(netNpaNbfc) * 100 * 10;

  // P = (100 - 0) / (100)
  const P = (100 - safeNum(O)) / 100;

  // Q = (100 - promoter pledge quantity) / 100 (convert from decimal to percentage first)
  const Q = (100 - safeNum(promoterPledgeQuantity) * 100) / 100;

  // Initial capital for return yearly = D * 100 / Repo Rate
  const initialCapitalReturnYearly = safeDivide(safeNum(D) * 100, REPO_RATE);

  // Initial capital for return quarterly = G * 400 / Repo Rate
  const initialCapitalReturnQuarterly = safeDivide(safeNum(G) * 400, REPO_RATE);

  // Initial average capital for return = (Initial capital for return yearly + Initial capital for return quarterly) / 2
  const initialAverageCapitalReturn =
    (safeNum(initialCapitalReturnYearly) + safeNum(initialCapitalReturnQuarterly)) / 2;

  // Initial capital return + asset = Initial average capital for return + Book value
  const initialCapitalReturnPlusAsset = safeNum(initialAverageCapitalReturn) + safeNum(bookValue);

  // Total Market Cap = (initial capital + asset) * L * Q * M * N * P
  const totalMarketCap =
    safeNum(initialCapitalReturnPlusAsset) *
    safeNum(L) *
    safeNum(Q) *
    safeNum(M) *
    safeNum(N) *
    safeNum(P);

  return {
    totalShares: safeNum(totalShares),
    bookValue: safeNum(bookValue),
    B: safeNum(B),
    C: safeNum(C),
    D: safeNum(D),
    E: safeNum(E),
    F: safeNum(F),
    G: safeNum(G),
    K: safeNum(K),
    L: safeNum(L),
    M: safeNum(M),
    N: safeNum(N),
    O: safeNum(O),
    P: safeNum(P),
    Q: safeNum(Q),
    initialCapitalReturnYearly: safeNum(initialCapitalReturnYearly),
    initialCapitalReturnQuarterly: safeNum(initialCapitalReturnQuarterly),
    initialAverageCapitalReturn: safeNum(initialAverageCapitalReturn),
    initialCapitalReturnPlusAsset: safeNum(initialCapitalReturnPlusAsset),
    totalMarketCap: safeNum(totalMarketCap),
    AA: safeNum(AA),
    BB: safeNum(BB),
    CC: safeNum(CC),
    DD: safeNum(DD),
  };
}

/**
 * Calculate Intrinsic Price Per Share
 * Formula: Total Market Cap / Total Shares
 */
export function calculateIntrinsicPrice(inputs: DcfInputs): number {
  const calculations = calculateHiddenValues(inputs);
  return safeDivide(calculations.totalMarketCap, calculations.totalShares);
}

/**
 * Calculate Actual Value Per Share
 * Formula: (Initial Capital + Assets) / Total Shares
 */
export function calculateActualValue(inputs: DcfInputs): number {
  const calculations = calculateHiddenValues(inputs);
  return safeDivide(calculations.initialCapitalReturnPlusAsset, calculations.totalShares);
}
