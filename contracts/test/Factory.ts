import {expect} from "chai";
import hre, {waffle, ethers, web3} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {Framework} from "@superfluid-finance/sdk-core";

import {LendingPool, LoanManager} from "@sctypes/contracts";
import {MockERC20, ProtocolFactory, SuperToken} from "@sctypes/index";
import {deploy, attach, getReceipt, getLogs} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {deployEnvironment, upgradeToken, createFlow, createSuperToken} from "@utils/superfluid";
import {LogDescription} from "@ethersproject/abi";

const {loadFixture} = waffle;

const errorHandler = (err: Error) => {
  if (err) throw err;
};

interface TestContext {
  user: SignerWithAddress;
  depositor: SignerWithAddress;
  accounts: SignerWithAddress[];
  superfluid: Framework;
  lendingPoolImpl: string;
  loanManagerImpl: string;
  factory: ProtocolFactory;
  superToken: SuperToken;
  token: MockERC20;
}

describe("Factory", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const superfluid = await deployEnvironment(hre, accounts[0]);
    const token = <MockERC20>await deploy(hre, "MockERC20", accounts[0], []);
    const superToken = await createSuperToken(hre, {token, superfluid});

    const loanManagerImpl = <LoanManager>await deploy(hre, "LoanManager", accounts[0], []);
    const lendingPoolImpl = <LendingPool>await deploy(hre, "LendingPool", accounts[0], []);
    const factory = <ProtocolFactory>(
      await deploy(hre, "ProtocolFactory", accounts[0], [loanManagerImpl.address, lendingPoolImpl.address])
    );

    const amount = ethers.utils.parseEther("10000");

    await mint(token, accounts[1], amount);
    await upgradeToken({token, superToken, amount, signer: accounts[1]});

    return {
      user: accounts[0],
      depositor: accounts[1],
      lendingPoolImpl: lendingPoolImpl.address,
      loanManagerImpl: loanManagerImpl.address,
      accounts,
      factory,
      superToken,
      token,
      superfluid,
    };
  };

  describe("Initialization", () => {
    it("Should initialize roles", async () => {
      const {factory, user} = await loadFixture(fixture);
      expect(await factory.hasRole(await factory.DEFAULT_ADMIN_ROLE(), user.address)).to.be.equal(true);
      expect(await factory.hasRole(await factory.UPDATER_ROLE(), user.address)).to.be.equal(true);
    });

    it("Should initialize implementations", async () => {
      const {factory, lendingPoolImpl, loanManagerImpl} = await loadFixture(fixture);
      expect(await factory.lendingPoolImplementation()).to.be.equal(lendingPoolImpl);
      expect(await factory.loanManagerImplementation()).to.be.equal(loanManagerImpl);
    });
  });

  describe("Factory functionality", () => {
    it("Should create a manager and pool", async () => {
      const {factory, superToken, superfluid, user} = await loadFixture(fixture);

      const tx = factory.createLoanManagerAndPool(superfluid.contracts.host.address, superToken.address);
      const createLog = <LogDescription>(
        getLogs(factory, await getReceipt(tx)).find(({name}) => name === "CreatedPortfolio")
      );

      expect(createLog.args.creator).to.be.equal(user.address);
      await expect(tx)
        .to.emit(factory, "CreatedPortfolio")
        .withArgs(createLog.args.manager, createLog.args.pool, createLog.args.creator);
    });

    it("Should initialize a the lendingPool", async () => {
      const {factory, superToken, superfluid, user} = await loadFixture(fixture);

      const tx = factory.createLoanManagerAndPool(superfluid.contracts.host.address, superToken.address);
      const createLog = <LogDescription>(
        getLogs(factory, await getReceipt(tx)).find(({name}) => name === "CreatedPortfolio")
      );

      const lendingPool = <LendingPool>await attach(hre, "LendingPool", createLog.args.pool);

      expect(await lendingPool.loanManager()).to.be.equal(createLog.args.manager);
      expect(await lendingPool.token()).to.be.equal(superToken.address);
      expect(await lendingPool.host()).to.be.equal(superfluid.contracts.host.address);
      expect(await lendingPool.cfa()).to.be.equal(superfluid.contracts.cfaV1.address);

      expect(await lendingPool.hasRole(await lendingPool.DEPOSITOR_ROLE(), user.address), "DEPOSITOR_ROLE").to.be.equal(
        true,
      );
      expect(await lendingPool.hasRole(await lendingPool.MANAGER_ROLE(), user.address), "MANAGER_ROLE").to.be.equal(
        true,
      );
      expect(
        await lendingPool.hasRole(await lendingPool.DEFAULT_ADMIN_ROLE(), user.address),
        "DEFAULT_ADMIN_ROLE",
      ).to.be.equal(true);
    });

    it("Should initialize a the loanManager", async () => {
      const {factory, superToken, superfluid, user} = await loadFixture(fixture);

      const tx = factory.createLoanManagerAndPool(superfluid.contracts.host.address, superToken.address);
      const createLog = <LogDescription>(
        getLogs(factory, await getReceipt(tx)).find(({name}) => name === "CreatedPortfolio")
      );

      const loanManager = <LoanManager>await attach(hre, "LoanManager", createLog.args.manager);
      expect(await loanManager.host()).to.be.equal(superfluid.contracts.host.address);
      expect(await loanManager.cfa()).to.be.equal(superfluid.contracts.cfaV1.address);

      expect(await loanManager.hasRole(await loanManager.LENDING_POOL(), createLog.args.pool)).to.be.equal(true);
      expect(await loanManager.hasRole(await loanManager.DEFAULT_ADMIN_ROLE(), user.address)).to.be.equal(true);
      expect(await loanManager.hasRole(await loanManager.UPGRADER_ROLE(), user.address)).to.be.equal(true);
    });
  });
});
