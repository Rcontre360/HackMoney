// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { SuperAppBase } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { ILoanManager } from "./interfaces/ILoanManager.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

contract LoanManager is ILoanManager, Context, AccessControl, SuperAppBase {
    using CFAv1Library for CFAv1Library.InitData;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

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

    constructor(ISuperfluid _host, ISuperToken _token) {
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

    //TODO create loan data, create flowrate towards lending pool
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
}
