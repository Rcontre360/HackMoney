import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
import {Framework} from "@superfluid-finance/sdk-core";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {LendingPool, LoanManager, ConstantFlowAgreementV1, Superfluid} from "@sctypes/index";
import {MockERC20, SuperToken} from "@sctypes/index";
import {deploy, attach, deployBehindProxy} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {createFlow, approveFlow, createSuperToken, deployEnvironment, upgradeToken} from "@utils/superfluid";
import {increaseTime} from "@utils/index";

const {loadFixture} = waffle;

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  loanManager: LoanManager;
  superToken: SuperToken;
  token: MockERC20;
  superfluid: Framework;
}

describe("LoanManager", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const superfluid = await deployEnvironment(hre, accounts[0]);
    const token = <MockERC20>await deploy(hre, "MockERC20", accounts[0], []);
    const superToken = await createSuperToken(hre, {token, superfluid});
    const loanManager = <LoanManager>(
      await deployBehindProxy(hre, "LoanManager", [superfluid.contracts.host.address, superToken.address])
    );

    const amount = ethers.utils.parseEther("10000");

    await mint(token, accounts[0], amount);
    await upgradeToken({token, superToken, amount, signer: accounts[0]});
    await loanManager.grantRole(await loanManager.LENDING_POOL(), accounts[0].address);

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      loanManager,
      superToken,
      token,
      superfluid,
    };
  };

  const loanFixture = async (): Promise<TestContext & {loan: any}> => {
    const {loanManager, other, user, superToken, superfluid, accounts, ...rest} = await loadFixture(fixture);
    const loan = {
      principal: ethers.utils.parseEther("5"),
      flowRate: ethers.utils.parseEther("0.00001"),
      repaymentAmount: ethers.utils.parseEther("10000"),
      borrower: user.address,
      receiver: other.address,
      token: superToken.address,
      id: await loanManager.loanId(),
    };

    await approveFlow(hre, {sender: user, manager: loanManager.address, superToken, flowRate: 0, superfluid});
    await loanManager.createLoan(
      loan.principal,
      loan.repaymentAmount,
      loan.flowRate,
      loan.borrower,
      loan.receiver,
      loan.token,
    );
    return {loanManager, other, user, superToken, superfluid, accounts, loan, ...rest};
  };

  describe("Initialization", () => {
    it("Should initialize superfluid contracts", async () => {
      const {loanManager, user, superfluid} = await loadFixture(fixture);

      expect(await loanManager.host()).to.be.equal(superfluid.contracts.host.address);
      expect(await loanManager.cfa()).to.be.equal(superfluid.contracts.cfaV1.address);
    });

    it("Should initialize user role", async () => {
      const {loanManager, user} = await loadFixture(fixture);

      expect(
        await loanManager.hasRole(await loanManager.DEFAULT_ADMIN_ROLE(), user.address),
        "Doesnt have default role",
      );
    });
  });

  describe("Loans", () => {
    it("Should create loan metadata", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts} = await loadFixture(fixture);
      const loan = {
        id: await loanManager.loanId(),
        principal: ethers.utils.parseEther("5"),
        flowRate: ethers.utils.parseEther("0.001"),
        repaymentAmount: ethers.utils.parseEther("10"),
        borrower: user.address,
        receiver: other.address,
        token: superToken.address,
      };

      await approveFlow(hre, {sender: user, manager: loanManager.address, superToken, flowRate: 0, superfluid});
      const pendingTx = loanManager.createLoan(
        loan.principal,
        loan.repaymentAmount,
        loan.flowRate,
        loan.borrower,
        loan.receiver,
        loan.token,
      );
      const block = await ethers.provider.getBlock((await pendingTx).blockHash || "");
      await expect(pendingTx, "Create loan event").to.emit(loanManager, "CreateLoan").withArgs(loan.id);
      const createdLoan = await loanManager.loans(loan.id);

      expect(createdLoan.principal, "Principal").to.be.equal(loan.principal);
      expect(createdLoan.flowRate, "Flow rate").to.be.equal(loan.flowRate);
      expect(createdLoan.startDate, "Start date").to.be.equal(block.timestamp);
      expect(createdLoan.borrower, "Borrower").to.be.equal(loan.borrower);
      expect(createdLoan.status, "Status").to.be.equal(0); // LoanStatus.Issued
    });

    it("Should create superfluid stream", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts} = await loadFixture(fixture);
      const loan = {
        principal: ethers.utils.parseEther("5"),
        flowRate: ethers.utils.parseEther("0.001"),
        repaymentAmount: ethers.utils.parseEther("10"),
        borrower: user.address,
        receiver: other.address,
        token: superToken.address,
      };

      await approveFlow(hre, {sender: user, manager: loanManager.address, superToken, flowRate: 0, superfluid});
      await loanManager.createLoan(
        loan.principal,
        loan.repaymentAmount,
        loan.flowRate,
        loan.borrower,
        loan.receiver,
        loan.token,
      );
      await increaseTime(hre, 7 * 24 * 3600);

      expect(await superToken.balanceOf(loan.receiver)).to.be.gte(loan.flowRate.mul(7 * 24 * 3600 - 1));
      expect(await superToken.balanceOf(loan.receiver)).to.be.lte(loan.flowRate.mul(7 * 24 * 3600 + 1));
    });

    it("Should update loan allowance", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts, loan} = await loadFixture(loanFixture);
      const newFlowRate = loan.flowRate.div(2);

      await loanManager.updateLoanAllowance(loan.id, newFlowRate);
      const newLoan = await loanManager.loans(loan.id);

      expect(newLoan.minimumFlowRate).to.be.equal(newFlowRate);
    });

    it("Should update loan terms", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts, loan} = await loadFixture(loanFixture);
      const newFlowRate = loan.flowRate.div(2);

      await loanManager.updateLoanAllowance(loan.id, newFlowRate);
      await loanManager.updateLoanTerms(loan.id, newFlowRate);

      const newLoan = await loanManager.loans(loan.id);

      expect(newLoan.minimumFlowRate).to.be.equal(newFlowRate);
      expect(newLoan.flowRate).to.be.equal(newFlowRate);
    });

    it("Should finalize repayment", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts, loan} = await loadFixture(loanFixture);

      const actualLoan = await loanManager.loans(loan.id);
      const repaymentDuration = await loanManager.getRepaymentDuration(
        actualLoan.flowRate,
        actualLoan.startDate,
        actualLoan.repaymentAmount,
      );
      await increaseTime(hre, repaymentDuration.toNumber());
      await loanManager.finalizeRepayment(loan.id);

      const currentLoan = await loanManager.loans(loan.id);
      expect(currentLoan.status).to.be.equal(1);
    });
  });
});
