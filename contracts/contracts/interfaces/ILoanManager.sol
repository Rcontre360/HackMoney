// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ISuperToken, ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
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
        int96 minimumFlowRate;
        uint256 startDate;
        address borrower;
        LoanStatus status;
    }

    event CreateLoan(uint256 loanId);

    function createLoan(
        uint256 principal,
        int96 flowRate,
        uint256 repaymentDuration,
        address borrower,
        address receiver,
        address token
    ) external;

    function markLoanAsDefaulted(uint256 loanId) external;

    function updateLoanTerms(uint256 loanId, int96 minimumFlowRate) external;

    function initialize(ISuperfluid _host, ISuperToken _token) external;
}
