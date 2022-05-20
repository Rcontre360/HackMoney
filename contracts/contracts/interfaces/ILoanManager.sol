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
        uint256 repaymentAmount;
        int96 flowRate;
        int96 minimumFlowRate;
        uint256 startDate;
        address borrower;
        LoanStatus status;
    }

    event CreateLoan(uint256 loanId);

    function initialize(ISuperfluid _host, ISuperToken _token) external;

    function createLoan(
        uint256 principal,
        uint256 repaymentAmount,
        int96 flowRate,
        address borrower,
        address receiver,
        address token
    ) external;

    function updateLoanTerms(uint256 loanId, int96 minimumFlowRate) external;

    function updateLoanAllowance(uint256 loanId, int96 minimumFlowRate) external;

    function finalizeRepayment(uint256 loanId) external;
}
