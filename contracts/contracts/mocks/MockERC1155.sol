// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    constructor() ERC1155("https://game.example/api/item/{id}.json") {}

    function mint(
        address target,
        uint256 id,
        uint256 amount
    ) public {
        _mint(target, id, amount, "");
    }
}
