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
    actualPerShare: number;
    totalShares: number;
}
export interface DcfInputs {
    weightedAveCostOfCapital: number;
    sharesOutstanding: number;
    forecastedFCF: number;
    terminalYears: bigint;
    perpetualGrowthRate: number;
}
export interface backendInterface {
    processDcf(_inputs: DcfInputs): Promise<DcfOutputs>;
}
