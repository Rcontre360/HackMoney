// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/ILoanManager.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

contract FactoryProtocol is Ownable{

	struct LendingProtocol {
		ILendingPool pool;
		ILoanManager manager;
	}

	LendingProtocol[] public loansWithPools;

	constructor(){

	}

	function createLoanManagerAndPool(ISuperfluid _host, ISuperToken _token) public onlyOwner{
		// ILoanManager loan = new LoanManager(_host,_token);
		// ILendingPool pool = new LendingPool(_token, loan ,_host);
		// loan.grantRole(loan.MANAGER_ROLE(), address(pool));
		// LendingProtocol memory protocol;
		// protocol.manager = loan;
		// protocol.pool = pool;
		// loansWithPools.push(protocol);
	}
}