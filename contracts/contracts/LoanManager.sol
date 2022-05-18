// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { SuperAppBase } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { Proxiable } from "./proxy/Proxiable.sol";
import { ILoanManager } from "./interfaces/ILoanManager.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

/** 
    @dev {LoanManager} manages loan data and repayment by users

    Users can change their money stream into the contract. Only the LendingPool 
    has the rights to create a loan. Once this is done the user starts the 
    repayment of the loan. 
 */

contract LoanManager is ILoanManager, Proxiable, ContextUpgradeable, AccessControlUpgradeable, SuperAppBase {
    using CFAv1Library for CFAv1Library.InitData;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    CFAv1Library.InitData public cfaV1;
    ISuperfluid public host;
    IConstantFlowAgreementV1 public cfa;
    ISuperToken public token;

    mapping(uint256 => LoanData) public loans;
    uint256 public loanId;

    modifier onlyHost() {
        require(msg.sender == address(host), "LotterySuperApp: support only one host");
        _;
    }

    constructor() {}

    /**
     * @dev Initializes the token and the superfluid protocol conections
     */
    function initialize(ISuperfluid _host, ISuperToken _token) external initializer {
        host = _host;
        token = _token;

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
     * @dev Create loan for user x. The transfer of funds towards the borrower is
     * managed by the lending pool.
     * @param principal amount received by borrower
     * @param flowRate repayment flow by user
     * @param repaymentDuration duration of flowRate
     * @param borrower borrower, duh
     * @param receiver receiver of flowRate. In this case is the LendingPool
     * @param token payment/principal token
     */
    function createLoan(
        uint256 principal,
        int96 flowRate,
        uint256 repaymentDuration,
        address borrower,
        address receiver,
        address token
    ) external onlyRole(MANAGER_ROLE) {
        loans[loanId] = LoanData(principal, flowRate, block.timestamp, repaymentDuration, borrower, LoanStatus.Issued);
        host.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.createFlowByOperator.selector,
                token,
                borrower,
                receiver,
                flowRate,
                new bytes(0)
            ),
            "0x"
        );
        emit CreateLoan(loanId);
        loanId++;
    }

    /**
     * @dev Callback on superfluid agreement. Check superfluid docs
     */
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        (, int96 flowRate, , ) = cfa.getFlow(token, borrower, address(this));

        emit DepositSuperfluid(flowRate);
        newCtx = ctx;
    }

    /**
     * @dev Callback on superfluid agreement. Check superfluid docs
     */
    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        (, int96 flowRate, , ) = cfa.getFlow(token, borrower, address(this));

        newCtx = ctx;
        emit DepositSuperfluid(flowRate);
    }

    /**
     * @dev Callback on superfluid agreement. Check superfluid docs
     */
    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        address borrower = host.decodeCtx(ctx).msgSender;
        (, int96 flowRate, , ) = cfa.getFlow(token, borrower, address(this));

        newCtx = ctx;
        emit DepositSuperfluid(flowRate);
    }

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}
}
