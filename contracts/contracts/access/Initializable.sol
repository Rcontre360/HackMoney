// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

abstract contract Initializable2 is UUPSUpgradeable, Initializable {
    constructor() initializer {}

    function initialize() internal initializer {
        // _setManager(_manager);
    }

    // function _authorizeUpgrade(address) internal override onlyManager {}
}