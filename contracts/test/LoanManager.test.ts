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
    await loanManager.grantRole(await loanManager.MANAGER_ROLE(), accounts[0].address);

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

  describe("Deposit", () => {
    it("Should receive a money stream", async () => {
      const {loanManager, user, other, superToken, token, superfluid} = await loadFixture(fixture);
      const flowRate = ethers.utils.parseEther("0.001");

      await expect(createFlow(hre, {superToken, sender: user, receiver: loanManager.address, flowRate, superfluid}))
        .to.emit(loanManager, "DepositSuperfluid")
        .withArgs(flowRate);
      await increaseTime(hre, 7 * 24 * 3600);

      expect(await superToken.balanceOf(loanManager.address)).to.be.gte(flowRate.mul(7 * 24 * 3600 - 1));
      expect(await superToken.balanceOf(loanManager.address)).to.be.lte(flowRate.mul(7 * 24 * 3600 + 1));
    });
  });

  describe("Create Loan", () => {
    it("Should create loan metadata", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts} = await loadFixture(fixture);
      const loan = {
        id: await loanManager.loanId(),
        principal: ethers.utils.parseEther("5"),
        flowRate: ethers.utils.parseEther("0.001"),
        repaymentDuration: 7 * 24 * 3600,
        borrower: user.address,
        receiver: other.address,
        token: superToken.address,
      };

      await approveFlow(hre, {sender: user, manager: loanManager.address, superToken, flowRate: 0, superfluid});
      const pendingTx = loanManager.createLoan(
        loan.principal,
        loan.flowRate,
        loan.repaymentDuration,
        loan.borrower,
        loan.receiver,
        loan.token,
      );
      const block = await ethers.provider.getBlock((await pendingTx).blockHash || "");
      await expect(pendingTx).to.emit(loanManager, "CreateLoan").withArgs(loan.id);
      const createdLoan = await loanManager.loans(loan.id);

      expect(createdLoan.principal).to.be.equal(loan.principal);
      expect(createdLoan.flowRate).to.be.equal(loan.flowRate);
      expect(createdLoan.startDate).to.be.equal(block.timestamp);
      expect(createdLoan.repaymentDuration).to.be.equal(loan.repaymentDuration);
      expect(createdLoan.borrower).to.be.equal(loan.borrower);
      expect(createdLoan.status).to.be.equal(0); // LoanStatus.Issued
    });
    it("Should create superfluid stream", async () => {
      const {loanManager, other, user, superToken, superfluid, accounts} = await loadFixture(fixture);
      const loan = {
        principal: ethers.utils.parseEther("5"),
        flowRate: ethers.utils.parseEther("0.001"),
        repaymentDuration: 7 * 24 * 3600,
        borrower: user.address,
        receiver: other.address,
        token: superToken.address,
      };

      await approveFlow(hre, {sender: user, manager: loanManager.address, superToken, flowRate: 0, superfluid});
      await loanManager.createLoan(
        loan.principal,
        loan.flowRate,
        loan.repaymentDuration,
        loan.borrower,
        loan.receiver,
        loan.token,
      );
      await increaseTime(hre, 7 * 24 * 3600);

      expect(await superToken.balanceOf(loan.receiver)).to.be.gte(loan.flowRate.mul(7 * 24 * 3600 - 1));
      expect(await superToken.balanceOf(loan.receiver)).to.be.lte(loan.flowRate.mul(7 * 24 * 3600 + 1));
    });
  });
});
