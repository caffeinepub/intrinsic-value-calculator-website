export interface DcfInputs {
  // Company Snapshot fields
  shareName: string;
  marketCap: number;
  ltp: number; // Last Traded Price
  revenueLastYear: number;
  netProfitLastYear: number;
  revenueLastQuarter: number;
  netProfitLastQuarter: number;
  pbRatio: number; // Price to Book ratio
  publicHolding: number; // as decimal (0.50 = 50%)
  promoterPledgeQuantity: number; // as decimal (0.125 = 12.5%)
  resultUpdatedSince6Years: boolean;
  psuOrNot: boolean; // Public Sector Undertaking
  netNpaNbfc: number; // Net Non-Performing Assets for NBFC, as decimal (0.032 = 3.2%)
}

export const DEFAULT_INPUTS: DcfInputs = {
  // Company Snapshot defaults
  shareName: '',
  marketCap: 0,
  ltp: 0,
  revenueLastYear: 0,
  netProfitLastYear: 0,
  revenueLastQuarter: 0,
  netProfitLastQuarter: 0,
  pbRatio: 0,
  publicHolding: 0,
  promoterPledgeQuantity: 0,
  resultUpdatedSince6Years: false,
  psuOrNot: false,
  netNpaNbfc: 0,
};

export const EXAMPLE_INPUTS: DcfInputs = {
  // Company Snapshot example values
  shareName: 'Example Corp',
  marketCap: 150000000000, // ₹150B
  ltp: 150,
  revenueLastYear: 50000000000, // ₹50B
  netProfitLastYear: 8000000000, // ₹8B
  revenueLastQuarter: 13000000000, // ₹13B
  netProfitLastQuarter: 2100000000, // ₹2.1B
  pbRatio: 3.5,
  publicHolding: 0.65, // 65%
  promoterPledgeQuantity: 0.125, // 12.5%
  resultUpdatedSince6Years: true,
  psuOrNot: false,
  netNpaNbfc: 0.032, // 3.2%
};
