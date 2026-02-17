import { DcfInputs } from './presets';
import { calculateAllFormulas } from './formulas';

export interface HiddenCalculations {
  totalShares: number;
  bookValue: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
  initialGrowth: number;
  industryGrowth: number;
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
}

/**
 * Calculate all hidden values based on the consolidated formulas
 * This function now references the single source of truth in formulas.ts
 */
export function calculateHiddenValues(inputs: DcfInputs): HiddenCalculations {
  const registry = calculateAllFormulas(inputs);

  return {
    totalShares: registry.totalShares.value,
    bookValue: registry.bookValue.value,
    B: registry.B.value,
    C: registry.C.value,
    D: registry.D.value,
    E: registry.E.value,
    F: registry.F.value,
    G: registry.G.value,
    H: registry.H.value,
    initialGrowth: registry.initialGrowth.value,
    industryGrowth: registry.industryGrowth.value,
    K: registry.K.value,
    L: registry.L.value,
    M: registry.M.value,
    N: registry.N.value,
    O: registry.O.value,
    P: registry.P.value,
    Q: registry.Q.value,
    initialCapitalReturnYearly: registry.initialCapitalReturnYearly.value,
    initialCapitalReturnQuarterly: registry.initialCapitalReturnQuarterly.value,
    initialAverageCapitalReturn: registry.initialAverageCapitalReturn.value,
    initialCapitalReturnPlusAsset: registry.initialCapitalReturnPlusAsset.value,
    totalMarketCap: registry.totalMarketCap.value,
  };
}

/**
 * Calculate Intrinsic Price Per Share
 * Formula: Total Market Cap ÷ Total Shares
 */
export function calculateIntrinsicPrice(inputs: DcfInputs): number {
  const registry = calculateAllFormulas(inputs);
  return registry.intrinsicPrice.value;
}

/**
 * Calculate Actual Value Per Share
 * Formula: (Initial Capital + Assets) ÷ Total Shares
 */
export function calculateActualValue(inputs: DcfInputs): number {
  const registry = calculateAllFormulas(inputs);
  return registry.actualValue.value;
}
