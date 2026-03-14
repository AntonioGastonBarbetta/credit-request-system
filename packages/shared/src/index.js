"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_USER_ID = exports.CreditRequestStatus = exports.CountryCode = void 0;
var CountryCode;
(function (CountryCode) {
    CountryCode["ES"] = "ES";
    CountryCode["PT"] = "PT";
})(CountryCode || (exports.CountryCode = CountryCode = {}));
var CreditRequestStatus;
(function (CreditRequestStatus) {
    CreditRequestStatus["PENDING"] = "PENDING";
    CreditRequestStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    CreditRequestStatus["DRAFT"] = "DRAFT";
    CreditRequestStatus["SUBMITTED"] = "SUBMITTED";
    CreditRequestStatus["APPROVED"] = "APPROVED";
    CreditRequestStatus["REJECTED"] = "REJECTED";
})(CreditRequestStatus || (exports.CreditRequestStatus = CreditRequestStatus = {}));
exports.SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
