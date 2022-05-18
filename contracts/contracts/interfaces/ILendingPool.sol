// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ISuperToken, ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { ILoanManager } from "./ILoanManager.sol";

interface ILendingPool {
    event Deposit(address indexed depositor, uint256 amount);

    event DepositSuperfluid(address indexed depositor, int96 flowRate);

    event Withdraw(address indexed withdrawer, uint256 amount);

    function initialize(
        ISuperToken _token,
        ILoanManager _loanManager,
        ISuperfluid _host
    ) external;

    function token() external view returns (ISuperToken);

    function deposit(uint256 amount) external;

    function withdraw(uint256 shares) external;

    function value() external view returns (uint256);
}
