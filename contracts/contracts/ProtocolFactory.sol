// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { ProxyWrapper } from "./proxy/ProxyWrapper.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";
import { ILoanManager } from "./interfaces/ILoanManager.sol";

contract ProtocolFactory is AccessControl {
    struct PortfoliosCreated {
        ILoanManager manager;
        ILendingPool pool;
    }

    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    address public loanManagerImplementation;
    address public lendingPoolImplementation;
    uint256 public portfolioId;

    mapping(uint256 => PortfoliosCreated) public portfolios;

    event CreatedPortfolio(ILoanManager manager, ILendingPool pool, address creator);

    constructor(address _loanManager, address _lendingPool) {
        loanManagerImplementation = _loanManager;
        lendingPoolImplementation = _lendingPool;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPDATER_ROLE, msg.sender);
    }

    function updateLoanManager(address _loanManager) external onlyRole(UPDATER_ROLE) {
        loanManagerImplementation = _loanManager;
    }

    function updateLendingPool(address _lendingPool) external onlyRole(UPDATER_ROLE) {
        lendingPoolImplementation = _lendingPool;
    }

    function getPortfolio(uint256 id) external view returns (ILoanManager manager, ILendingPool pool) {
        require(id < portfolioId, "ProtocolFactory:DOESNT_EXISTS");

        PortfoliosCreated memory port = portfolios[id];
        manager = port.manager;
        pool = port.pool;
    }

    function createLoanManagerAndPool(ISuperfluid _host, ISuperToken _token)
        public
        returns (ILoanManager manager, ILendingPool pool)
    {
        address creator = msg.sender;
        manager = _createLoanManager(_host, _token, creator);
        pool = _createLendingPool(_token, manager, _host, creator);
        portfolios[portfolioId] = PortfoliosCreated(manager, pool);

        AccessControl(address(manager)).grantRole(keccak256("LENDING_POOL"), address(pool));

        portfolioId++;
        emit CreatedPortfolio(manager, pool, creator);
    }

    function _createLoanManager(
        ISuperfluid _host,
        ISuperToken _token,
        address owner
    ) private returns (ILoanManager manager) {
        bytes memory initCalldata = abi.encodeWithSelector(ILoanManager.initialize.selector, _host, _token);
        bytes32 UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

        manager = ILoanManager(address(new ProxyWrapper(address(loanManagerImplementation), initCalldata)));
        AccessControl(address(manager)).grantRole(UPGRADER_ROLE, owner);
        AccessControl(address(manager)).grantRole(DEFAULT_ADMIN_ROLE, owner);
    }

    function _createLendingPool(
        ISuperToken _token,
        ILoanManager _loanManager,
        ISuperfluid _host,
        address owner
    ) private returns (ILendingPool pool) {
        bytes memory initCalldata = abi.encodeWithSelector(
            ILendingPool.initialize.selector,
            _token,
            _loanManager,
            _host
        );
        bytes32 DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");
        bytes32 MANAGER_ROLE = keccak256("MANAGER_ROLE");

        pool = ILendingPool(address(new ProxyWrapper(address(lendingPoolImplementation), initCalldata)));
        AccessControl(address(pool)).grantRole(DEPOSITOR_ROLE, owner);
        AccessControl(address(pool)).grantRole(MANAGER_ROLE, owner);
        AccessControl(address(pool)).grantRole(DEFAULT_ADMIN_ROLE, owner);
    }
}
