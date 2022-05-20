// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { Proxiable } from "./proxy/Proxiable.sol";
import { ILoanManager } from "./interfaces/ILoanManager.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

/** 
    @dev {LoanManager} manages loan data and repayment by users

    Users can change their money stream into the contract. Only the LendingPool 
    has the rights to create a loan. Once this is done the user starts the 
    repayment of the loan. 
 */

contract LoanManager is ILoanManager, Proxiable, ContextUpgradeable, AccessControlUpgradeable {
    bytes32 public constant LENDING_POOL = keccak256("LENDING_POOL");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(uint256 => LoanData) public loans;
    uint256 public loanId;

    constructor() {}

    function initialize() external initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create loan for user x. The transfer of funds towards the borrower is
     * managed by the lending pool.
     * @param principal amount received by borrower
     * @param flowRate repayment flow by user
     * @param borrower borrower, duh
     */
    function createLoan(
        uint256 principal,
        uint256 repaymentAmount,
        int96 flowRate,
        address borrower
    ) external onlyRole(LENDING_POOL) {
        loans[loanId] = LoanData(
            principal,
            repaymentAmount,
            flowRate,
            flowRate,
            block.timestamp,
            borrower,
            LoanStatus.Issued
        );
        emit CreateLoan(loanId);
        loanId++;
    }

    function updateLoanAllowance(uint256 loanId, int96 minimumFlowRate) external onlyRole(LENDING_POOL) {
        LoanData storage data = loans[loanId];
        require(data.startDate > 0, "LoanManager:DOESNT_EXISTS");
        require(minimumFlowRate < data.flowRate, "LoanManager:INVALID_FLOW_RATE");

        data.minimumFlowRate = minimumFlowRate;
    }

    function updateLoanTerms(uint256 loanId, int96 newFlowRate) external onlyRole(LENDING_POOL) {
        LoanData storage data = loans[loanId];
        require(data.startDate > 0, "LoanManager:DOESNT_EXISTS");

        data.flowRate = newFlowRate;
        if (newFlowRate < data.minimumFlowRate) data.status = LoanStatus.Defaulted;
    }

    function finalizeRepayment(uint256 loanId) external onlyRole(LENDING_POOL) {
        LoanData storage data = loans[loanId];
        require(data.startDate > 0, "LoanManager:DOESNT_EXISTS");

        uint256 duration = getRepaymentDuration(data.flowRate, data.startDate, data.repaymentAmount);
        if (duration <= 0) data.status = LoanStatus.Repaid;
        else data.status = LoanStatus.Defaulted;
    }

    function getRepaymentDuration(
        int96 flowRate,
        uint256 startDate,
        uint256 repaymentAmount
    ) public view returns (uint256) {
        uint256 totalPaid = uint256(uint96(flowRate)) * (block.timestamp - startDate);
        if (totalPaid > repaymentAmount) return 0;
        uint256 unpaidAmount = repaymentAmount - totalPaid;
        return unpaidAmount / uint96(flowRate) + (block.timestamp - startDate);
    }

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}
}
