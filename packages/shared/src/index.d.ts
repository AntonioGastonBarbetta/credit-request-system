export declare enum CountryCode {
    ES = "ES",
    PT = "PT"
}
export declare enum CreditRequestStatus {
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";
export type AuthToken = {
    accessToken: string;
    expiresAt: string;
};
export type CreditRequest = {
    id: string;
    country: CountryCode;
    status: CreditRequestStatus;
    payload: Record<string, unknown>;
};
