import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DcfOutputs {
    totalMarketCap: number;
    intrinsicPricePerShare: number;
    adjustedValuation: number;
    actualPerShare: number;
    riskDiscount: number;
    profitability: number;
    industryGrowth: number;
    totalShares: number;
}
export interface DcfInputs {
    weightedAveCostOfCapital: number;
    sharesOutstanding: number;
    forecastedFCF: number;
    terminalYears: bigint;
    actualSharePrice: number;
    revenueLastYear: number;
    revenueLastQuarter: number;
    perpetualGrowthRate: number;
}
export interface backendInterface {
    processDcf(inputs: DcfInputs): Promise<DcfOutputs>;
}
