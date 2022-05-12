// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { SuperAppBase } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { ILendingPool } from "./interfaces/ILendingPool.sol";
import { ILoanManager } from "./interfaces/ILoanManager.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

contract LendingPool is ILendingPool, Context, AccessControl, SuperAppBase {
    using SafeERC20 for ISuperToken;
    using CFAv1Library for CFAv1Library.InitData;

    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    CFAv1Library.InitData public cfaV1;
    ISuperfluid public host;
    IConstantFlowAgreementV1 public cfa;

    ISuperToken public token;
    ILoanManager public loanManager;

    constructor(
        ISuperToken _token,
        ILoanManager _loanManager,
        ISuperfluid _host
    ) {
        token = _token;
        host = _host;
        loanManager = _loanManager;

        cfa = IConstantFlowAgreementV1(
            address(host.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
        );
        cfaV1 = CFAv1Library.InitData(host, cfa);
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deposit(uint256 amount) external onlyRole(DEPOSITOR_ROLE) {
        require(amount > 0, "LendingPool: AMOUNT_ZERO");
        address sender = _msgSender();

        token.safeTransferFrom(sender, address(this), amount);
        emit Deposit(sender, amount);
    }

    function withdraw(uint256 amount) external onlyRole(DEPOSITOR_ROLE) {
        address sender = _msgSender();
        uint256 funds = token.balanceOf(address(this));

        token.safeTransfer(sender, amount);
        emit Withdraw(sender, amount);
    }

    function createLoan(
        uint256 principal,
        int96 flowRate,
        uint256 repaymentDuration,
        address borrower
    ) external onlyRole(MANAGER_ROLE) {
        token.safeTransfer(borrower, principal);
        loanManager.createLoan(principal, flowRate, repaymentDuration, borrower, address(this), address(token));
    }

    function sharesGivenAmount(uint256 amount) public view returns (uint256) {
        uint256 _totalSupply = token.totalSupply();
        return _totalSupply;
    }

    function value() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        _checkRole(DEPOSITOR_ROLE, borrower);
        (, int96 flowRate, , ) = cfa.getFlow(token, borrower, address(this));

        emit DepositSuperfluid(borrower, flowRate);
        newCtx = ctx;
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        _checkRole(DEPOSITOR_ROLE, borrower);
        newCtx = ctx;
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        _checkRole(DEPOSITOR_ROLE, borrower);
        newCtx = ctx;
    }
}
