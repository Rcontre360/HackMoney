// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { SuperAppBase } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { Proxiable } from "./proxy/Proxiable.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";
import { ILoanManager } from "./interfaces/ILoanManager.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

contract LendingPool is ILendingPool, Proxiable, ContextUpgradeable, AccessControlUpgradeable, SuperAppBase {
    using SafeERC20 for ISuperToken;
    using CFAv1Library for CFAv1Library.InitData;

    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    CFAv1Library.InitData public cfaV1;
    ISuperfluid public host;
    IConstantFlowAgreementV1 public cfa;

    ISuperToken public token;
    ILoanManager public loanManager;

    constructor() {}

    /**
     * @dev Initializes token, loan manager and superfluid
     */
    function initialize(
        ISuperToken _token,
        ILoanManager _loanManager,
        ISuperfluid _host
    ) public initializer {
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

    /**
     * @dev allows the DAO deposit funds using normal ERC20 tokens
     * @param amount amount of token to desposit
     */
    function deposit(uint256 amount) external onlyRole(DEPOSITOR_ROLE) {
        require(amount > 0, "LendingPool: AMOUNT_ZERO");
        address sender = _msgSender();

        token.safeTransferFrom(sender, address(this), amount);
        emit Deposit(sender, amount);
    }

    /**
     * @dev allows the DAO withdraw funds using normal ERC20 tokens
     * @param amount amount of token to withdraw
     */
    function withdraw(uint256 amount) external onlyRole(DEPOSITOR_ROLE) {
        address sender = _msgSender();
        uint256 funds = token.balanceOf(address(this));
        token.safeTransfer(sender, amount);
        emit Withdraw(sender, amount);
    }

    /**
     * @dev allows the DAO create loans to members/external wallets
     * @param principal amount received by borrower
     * @param flowRate payment rate by borrower
     * @param repaymentDuration flowRate duration
     * @param borrower borrower address
     */
    function createLoan(
        uint256 principal,
        int96 flowRate,
        uint256 repaymentDuration,
        address borrower
    ) external onlyRole(MANAGER_ROLE) {
        token.safeTransfer(borrower, principal);
        loanManager.createLoan(principal, flowRate, repaymentDuration, borrower, address(this), address(token));
    }

    /**
     * @dev returns total value of the pool
     */
    function value() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @dev superfluid callback. Check superfluid docs. only allows the depositor to
     * create a stream towards the contract. Because the dao must be the only depositor
     */
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

    /**
     * @dev superfluid callback. Check superfluid docs
     */
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

    /**
     * @dev superfluid callback. Check superfluid docs
     */
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

    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
