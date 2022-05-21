import {expect} from "chai";
import hre, {waffle, ethers, web3} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {Framework} from "@superfluid-finance/sdk-core";

import {LendingPool, LoanManager} from "@sctypes/contracts";
import {MockERC20, SuperToken, Superfluid, ConstantFlowAgreementV1} from "@sctypes/index";
import {deploy, deployBehindProxy, attach} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {deployEnvironment, upgradeToken, createFlow, createSuperToken, approveFlow} from "@utils/superfluid";
import {increaseTime} from "@utils/index";

const {loadFixture} = waffle;

const errorHandler = (err: Error) => {
  if (err) throw err;
};

interface TestContext {
  dao: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  superfluid: Framework;
  loanManager: LoanManager;
  lendingPool: LendingPool;
  superToken: SuperToken;
  token: MockERC20;
}

describe("LendingPool", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const superfluid = await deployEnvironment(hre, accounts[0]);
    const token = <MockERC20>await deploy(hre, "MockERC20", accounts[0], []);
    const superToken = await createSuperToken(hre, {token, superfluid});
    const loanManager = <LoanManager>await deployBehindProxy(hre, "LoanManager", []);
    const lendingPool = <LendingPool>(
      await deployBehindProxy(hre, "LendingPool", [
        superToken.address,
        loanManager.address,
        superfluid.contracts.host.address,
      ])
    );

    const amount = ethers.utils.parseEther("10000");

    await mint(token, accounts[1], amount);
    await upgradeToken({token, superToken, amount, signer: accounts[1]});
    await mint(token, accounts[0], amount);
    await upgradeToken({token, superToken, amount, signer: accounts[0]});

    await loanManager.grantRole(await loanManager.LENDING_POOL(), lendingPool.address);
    await loanManager.grantRole(await loanManager.UPGRADER_ROLE(), accounts[0].address);

    return {
      dao: accounts[0],
      other: accounts[1],
      accounts,
      loanManager,
      lendingPool,
      superToken,
      token,
      superfluid,
    };
  };

  const loanFixture = async () => {
    const {dao, other, lendingPool, loanManager, superToken, superfluid, ...rest} = await loadFixture(fixture);
    const loan = {
      principal: ethers.utils.parseEther("5"),
      flowRate: ethers.utils.parseEther("0.00001"),
      repaymentAmount: ethers.utils.parseEther("10000"),
      borrower: other.address,
      token: superToken.address,
      id: await loanManager.loanId(),
    };

    await superToken.approve(lendingPool.address, loan.principal);
    await lendingPool.deposit(loan.principal);

    await approveFlow(hre, {sender: other, manager: dao.address, superToken, flowRate: 0, superfluid});

    const host = <Superfluid>await attach(hre, "Superfluid", superfluid.contracts.host.address);
    const cfa = <ConstantFlowAgreementV1>(
      await attach(hre, "ConstantFlowAgreementV1", superfluid.contracts.cfaV1.address)
    );

    await host
      .connect(dao)
      .callAgreement(
        superfluid.contracts.cfaV1.address,
        cfa.interface.encodeFunctionData("createFlowByOperator", [
          superToken.address,
          other.address,
          lendingPool.address,
          loan.flowRate,
          [],
        ]),
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "uint256"],
          [other.address, loan.repaymentAmount, loan.principal],
        ),
      );

    return {
      dao,
      other,
      lendingPool,
      loanManager,
      superToken,
      superfluid,
      loan,
      ...rest,
    };
  };

  describe("Initialization", () => {
    it("Should initialize dependencies", async () => {
      const {lendingPool, loanManager, superToken, superfluid} = await loadFixture(fixture);
      expect(await lendingPool.loanManager()).to.be.equal(loanManager.address);
      expect(await lendingPool.token()).to.be.equal(superToken.address);
      expect(await lendingPool.host()).to.be.equal(superfluid.contracts.host.address);
      expect(await lendingPool.cfa()).to.be.equal(superfluid.contracts.cfaV1.address);
    });

    it("Should initialize roles", async () => {
      const {lendingPool, dao} = await loadFixture(fixture);
      expect(await lendingPool.hasRole(await lendingPool.DEFAULT_ADMIN_ROLE(), dao.address)).to.be.equal(true);
    });
  });

  describe("Loans", () => {
    it("Should create a loan on flow rate created", async () => {
      const {lendingPool, loanManager, superToken, superfluid, other, dao, loan} = await loadFixture(loanFixture);
      const currentLoan = await loanManager.loans(loan.id);

      expect(currentLoan.borrower).to.be.equal(loan.borrower);
      expect(currentLoan.repaymentAmount).to.be.equal(loan.repaymentAmount);
      expect(currentLoan.principal).to.be.equal(loan.principal);
      expect(currentLoan.flowRate).to.be.equal(loan.flowRate);
      expect(currentLoan.status).to.be.equal(0);
      expect(currentLoan.startDate).to.be.gt(0);
    });

    it("Should create a loan on flow rate created", async () => {
      const {lendingPool, loanManager, superToken, superfluid, other, dao, loan} = await loadFixture(loanFixture);
      const currentLoan = await loanManager.loans(loan.id);

      expect(currentLoan.borrower).to.be.equal(loan.borrower);
      expect(currentLoan.repaymentAmount).to.be.equal(loan.repaymentAmount);
      expect(currentLoan.principal).to.be.equal(loan.principal);
      expect(currentLoan.flowRate).to.be.equal(loan.flowRate);
      expect(currentLoan.status).to.be.equal(0);
      expect(currentLoan.startDate).to.be.gt(0);
    });
  });
});
