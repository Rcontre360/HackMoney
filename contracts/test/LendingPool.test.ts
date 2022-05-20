import {expect} from "chai";
import hre, {waffle, ethers, web3} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {Framework} from "@superfluid-finance/sdk-core";

import {LendingPool, LoanManager} from "@sctypes/contracts";
import {MockERC20, SuperToken} from "@sctypes/index";
import {deploy, deployBehindProxy, attach} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {deployEnvironment, upgradeToken, createFlow, createSuperToken, approveFlow} from "@utils/superfluid";
import {increaseTime} from "@utils/index";

const {loadFixture} = waffle;

const errorHandler = (err: Error) => {
  if (err) throw err;
};

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  depositor: SignerWithAddress;
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
    const loanManager = <LoanManager>(
      await deployBehindProxy(hre, "LoanManager", [superfluid.contracts.host.address, superToken.address])
    );
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
    await lendingPool.grantRole(await lendingPool.MANAGER_ROLE(), accounts[0].address);
    await lendingPool.grantRole(await lendingPool.DEPOSITOR_ROLE(), accounts[1].address);

    return {
      user: accounts[0],
      other: accounts[2],
      depositor: accounts[1],
      accounts,
      loanManager,
      lendingPool,
      superToken,
      token,
      superfluid,
    };
  };

  const loanFixture = async () => {
    const {user, other, depositor, lendingPool, loanManager, superToken, superfluid, ...rest} = await loadFixture(
      fixture,
    );
    const loan = {
      principal: ethers.utils.parseEther("5"),
      flowRate: ethers.utils.parseEther("0.00001"),
      repaymentAmount: ethers.utils.parseEther("10000"),
      borrower: user.address,
      receiver: other.address,
      token: superToken.address,
      id: await loanManager.loanId(),
    };

    await superToken.connect(depositor).approve(lendingPool.address, loan.principal);
    await lendingPool.connect(depositor).deposit(loan.principal);
    await approveFlow(hre, {sender: user, manager: lendingPool.address, superToken, flowRate: 0, superfluid});
    await lendingPool.createLoan(loan.principal, loan.repaymentAmount, loan.flowRate, loan.borrower);

    return {
      user,
      other,
      depositor,
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
      const {lendingPool, user} = await loadFixture(fixture);
      expect(await lendingPool.hasRole(await lendingPool.DEFAULT_ADMIN_ROLE(), user.address)).to.be.equal(true);
    });
  });

  describe("Deposit", () => {
    it("Should receive superfluid flowRate", async () => {
      const {lendingPool, loanManager, superToken, superfluid, depositor} = await loadFixture(fixture);
      const flowRate = ethers.utils.parseEther("0.001");

      await expect(
        createFlow(hre, {superToken, sender: depositor, receiver: lendingPool.address, flowRate, superfluid}),
      )
        .to.emit(lendingPool, "DepositSuperfluid")
        .withArgs(depositor.address, flowRate);
      await increaseTime(hre, 7 * 24 * 3600);
    });
  });

  describe.only("Loans update", () => {
    it("Should update loans allowance", async () => {
      const {user, other, lendingPool, loanManager, superToken, superfluid, depositor} = await loadFixture(
        loanFixture,
      );
    });
  });
});
