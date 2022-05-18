// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

// Needed for Etherscan verification
contract Proxiable is Initializable, UUPSUpgradeable {
    constructor() {}

    function _authorizeUpgrade(address) internal virtual override {}
}
