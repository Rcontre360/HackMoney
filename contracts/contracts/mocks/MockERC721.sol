// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mock721 is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(address account, uint256 nftId) public {
        _mint(account, nftId);
    }
}
