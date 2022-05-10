// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IMintableSuperToken } from "./IMintableSuperToken.sol";

interface ILendingPool {
    event Deposit(address indexed depositor, uint256 amount);

    event Withdraw(address indexed withdrawer, uint256 amount);

    event Forwarded(address indexed to, uint256 amount);

    function token() external view returns (IMintableSuperToken);

    function deposit(uint256 amount) external;

    function withdraw(uint256 shares) external;

    function sharesGivenAmount(uint256 amount) external view returns (uint256);

    function value() external view returns (uint256);

    function unpaidAmount() external view returns (uint256);
}
