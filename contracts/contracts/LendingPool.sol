// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { SuperAppBase } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { IMintableSuperToken } from "./interfaces/IMintableSuperToken.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

contract LendingPool is ILendingPool, Context, Ownable, SuperAppBase {
    using SafeERC20 for IMintableSuperToken;
    using CFAv1Library for CFAv1Library.InitData;

    CFAv1Library.InitData public cfaV1;
    ISuperfluid public host;
    IConstantFlowAgreementV1 public cfa;

    IMintableSuperToken public token;
    IMintableSuperToken public sharesToken;

    constructor(IMintableSuperToken _token, ISuperfluid _host) {
        token = _token;
        host = _host;
        cfa = IConstantFlowAgreementV1(
            address(host.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
        );
        cfaV1 = CFAv1Library.InitData(host, cfa);
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "LendingPool: AMOUNT_ZERO");
        address sender = _msgSender();
        uint256 shares = sharesGivenAmount(amount);

        token.safeTransferFrom(sender, address(this), amount);
        sharesToken.mint(sender, shares, "");

        emit Deposit(sender, amount, shares);
    }

    function withdraw(uint256 shares) external {
        address sender = _msgSender();
        uint256 funds = token.balanceOf(address(this));
        uint256 finalWithdraw = (shares * funds) / sharesToken.totalSupply();

        sharesToken.burn(sender, shares, "");
        token.safeTransfer(sender, finalWithdraw);

        emit Withdraw(sender, shares, finalWithdraw);
    }

    function sharesGivenAmount(uint256 amount) public view returns (uint256) {
        uint256 _totalSupply = sharesToken.totalSupply();
        if (_totalSupply == 0) {
            return (amount * 10**sharesToken.decimals()) / (10**token.decimals());
        } else {
            return (amount * _totalSupply) / value();
        }
    }

    function value() public view returns (uint256) {
        return token.balanceOf(address(this)) + unpaidAmount();
    }

    function unpaidAmount() public view returns (uint256) {
        //TODO finish unpaid amount calculation
        return 0;
    }

    function _forward(address to, uint256 amount) internal {
        token.transfer(to, amount);
        emit Forwarded(to, amount);
    }

    function _updateOutflow(bytes calldata ctx) private returns (bytes memory newCtx) {
        newCtx = ctx;
    }

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        newCtx = _updateOutflow(ctx);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        newCtx = _updateOutflow(ctx);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata ctx
    ) external override returns (bytes memory newCtx) {
        newCtx = _updateOutflow(ctx);
    }
}
