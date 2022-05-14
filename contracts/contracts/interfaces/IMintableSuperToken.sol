// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.13;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

interface IMintableSuperToken is ISuperToken {
    function mint(
        address receiver,
        uint256 amount,
        bytes memory userData
    ) external;

    function burn(
        address account,
        uint256 amount,
        bytes memory userData
    ) external;
}
