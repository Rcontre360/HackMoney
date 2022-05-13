import { expect } from "chai";
import hre, { waffle, ethers, web3 } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Framework } from "@superfluid-finance/sdk-core";

import { LendingPool, LoanManager } from "@sctypes/contracts";
import { MockERC20, SuperToken } from "@sctypes/index";
import { deploy, attach } from "@utils/contracts";
import { mint } from "@utils/erc20";
import { deployEnvironment, upgradeToken, createFlow, createSuperToken } from "@utils/superfluid";
import { increaseTime } from "@utils/index";

const { loadFixture } = waffle;

const errorHandler = (err: Error) => {
  if (err) throw err;
};

interface TestContext {
  user: SignerWithAddress;
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
    const superToken = await createSuperToken(hre, { token, superfluid });
    const loanManager = <LoanManager>(
      await deploy(hre, "LoanManager", accounts[0], [superfluid.contracts.host.address, superToken.address])
    );
    const lendingPool = <LendingPool>(
      await deploy(hre, "LendingPool", accounts[0], [
        superToken.address,
        loanManager.address,
        superfluid.contracts.host.address,
      ])
    );

    const amount = ethers.utils.parseEther("10000");

    await mint(token, accounts[1], amount);
    await upgradeToken({ token, superToken, amount, signer: accounts[1] });
    await loanManager.grantRole(await loanManager.MANAGER_ROLE(), accounts[0].address);
    await lendingPool.grantRole(await lendingPool.MANAGER_ROLE(), accounts[0].address);
    await lendingPool.grantRole(await lendingPool.DEPOSITOR_ROLE(), accounts[1].address);

    return {
      user: accounts[0],
      depositor: accounts[1],
      accounts,
      loanManager,
      lendingPool,
      superToken,
      token,
      superfluid,
    };
  };

  describe("Initialization", () => {
    it("Should initialize dependencies", async () => {
      const { lendingPool, loanManager, superToken, superfluid } = await loadFixture(fixture);
      expect(await lendingPool.loanManager()).to.be.equal(loanManager.address);
      expect(await lendingPool.token()).to.be.equal(superToken.address);
      expect(await lendingPool.host()).to.be.equal(superfluid.contracts.host.address);
      expect(await lendingPool.cfa()).to.be.equal(superfluid.contracts.cfaV1.address);
    });
  });

  describe("Deposit", () => {
    it("Should receive superfluid flowRate", async () => {
      const { lendingPool, loanManager, superToken, superfluid, depositor } = await loadFixture(fixture);
      const flowRate = ethers.utils.parseEther("0.001");

      await expect(
        createFlow(hre, { superToken, sender: depositor, receiver: lendingPool.address, flowRate, superfluid }),
      )
        .to.emit(lendingPool, "DepositSuperfluid")
        .withArgs(depositor.address, flowRate);
      await increaseTime(hre, 7 * 24 * 3600);
    });
  });
});
