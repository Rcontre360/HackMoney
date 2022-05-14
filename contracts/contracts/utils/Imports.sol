// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.13;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SuperToken } from "@superfluid-finance/ethereum-contracts/contracts/superfluid/SuperToken.sol";
import { SuperTokenFactory } from "@superfluid-finance/ethereum-contracts/contracts/superfluid/SuperTokenFactory.sol";
import { Superfluid } from "@superfluid-finance/ethereum-contracts/contracts/superfluid/Superfluid.sol";
import { ConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/agreements/ConstantFlowAgreementV1.sol";

import { SuperTokenStorage } from "./SuperTokenStorage.sol";
import { UUPSProxy } from "./UUPSProxy.sol";

contract Imports {}
