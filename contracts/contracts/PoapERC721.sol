// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ILoanManager.sol";

contract POAPChainScore is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    enum LoanStatus {
        Issued,
        Repaid,
        Defaulted
    }

    struct LoanData {
        uint256 principal;
        int96 flowRate;
        uint256 startDate;
        uint256 repaymentDuration;
        address borrower;
        LoanStatus status;
    }

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Counters.Counter private _tokenIdCounter;

    string private baseURI;

    mapping(uint256 => LoanData) public POAPloans;

    constructor(string memory _baseURI) ERC721("POAPChainScore", "CS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        baseURI = _baseURI;
    }

    function safeMint(
        address to,
        LoanData memory loanData,
        uint256 id
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        POAPloans[id] = loanData;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function setBaseURI(string memory _baseURI) public onlyRole(URI_SETTER_ROLE) {
        baseURI = _baseURI;
    }

    function getLoanData(uint256 id) external view returns (LoanData memory) {
        return POAPloans[id];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
