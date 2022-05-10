// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IMintableSuperToken } from "./IMintableSuperToken.sol";

interface ILoanManager {
    enum LoanStatus {
        Issued,
        Repaid,
        Defaulted
    }

    struct LoanData {
        uint256 principal;
        int96 flowRate;
        uint256 startDate;
        uint256 repaymentDuration;
        address borrower;
        LoanStatus status;
    }

    function createLoan(
        uint256 principal,
        int96 flowRate,
        uint256 repaymentDuration,
        address borrower
    ) external;
}
