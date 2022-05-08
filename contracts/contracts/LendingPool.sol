// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import { OwnableInitializable } from "./access/OwnableInitializable.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";
import { IERC20Decimals } from "./interfaces/IERC20Decimals.sol";

contract LendingPool is ILendingPool, ContextUpgradeable, OwnableInitializable, ERC20Upgradeable {
    using SafeERC20 for IERC20Decimals;

    IERC20Decimals public token;

    constructor(IERC20Decimals _token) {}

    function initialize(IERC20Decimals _token) external initialize {
        token = _token;
        ERC20Upgradeable.initialize("Lending Pool token", "LP");
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "LendingPool: AMOUNT_ZERO");
        address sender = _msgSender();
        uint256 shares = sharesGivenAmount(amount);

        token.safeTransferFrom(sender, address(this), amount);
        _mint(sender, shares);

        emit Deposit(sender, amount, shares);
    }

    function withdraw(uint256 shares) external {
        address sender = _msgSender();
        uint256 funds = token.balanceOf(address(this));
        uint256 finalWithdraw = (shares * funds) / totalSupply();

        _burn(sender, shares);
        token.safeTransfer(sender, finalWithdraw);

        emit Withdraw(sender, shares, finalWithdraw);
    }

    function forward(address[] memory targets, uint256[] memory amounts) external onlyOwner {
        require(targets.length == amounts.length, "LendingPool:Input length mismatch");
        for (uint256 i = 0; i < targets.length; i++) _forward(targets[i], amounts[i]);
    }

    function sharesGivenAmount(uint256 amount) public view returns (uint256) {
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            return (amount * 10**decimals()) / (10**token.decimals());
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
}
