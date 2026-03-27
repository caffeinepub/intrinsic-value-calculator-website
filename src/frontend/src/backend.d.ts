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
    totalShares: number;
}
export interface ContactMessage {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface VisitorDetails {
    id: bigint;
    name: string;
    email: string;
    mobile: string;
    timestamp: bigint;
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
export interface UserProfile {
    mobileNumber: string;
    lastName: string;
    firstName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getAllVisitorDetails(): Promise<Array<VisitorDetails>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNumAllUserProfiles(): Promise<bigint | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    processDcf(inputs: DcfInputs): Promise<DcfOutputs>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<void>;
    submitVisitorDetails(name: string, email: string, mobile: string): Promise<void>;
}
