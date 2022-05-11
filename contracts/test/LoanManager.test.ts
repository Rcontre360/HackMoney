import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
import {Framework} from "@superfluid-finance/sdk-core";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {LendingPool, LoanManager} from "@sctypes/contracts";
import {MockERC20, SuperToken} from "@sctypes/index";
import {deploy, attach} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {createFlow, createSuperToken, deployEnvironment, upgradeToken} from "@utils/superfluid";
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

describe.only("LoanManager", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const superfluid = await deployEnvironment(hre, accounts[0]);
    const token = <MockERC20>await deploy(hre, "MockERC20", accounts[0], []);
    console.log("CREATE TOKEN");
    const superToken = await createSuperToken(hre, {token, superfluid});
    const loanManager = <LoanManager>await deploy(hre, "LoanManager", accounts[0], [superfluid.contracts.host.address]);

    const amount = ethers.utils.parseEther("10000");

    await mint(token, accounts[0], amount);
    await upgradeToken(hre, {token, superToken, amount});
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

  describe("Deposit", async () => {
    it("Should receive a money stream", async () => {
      const {loanManager, user, other, superToken, token, superfluid} = await loadFixture(fixture);
      const flowRate = ethers.utils.parseEther("0.001");

      await expect(createFlow(hre, {superToken, sender: user, receiver: loanManager.address, flowRate, superfluid}))
        .to.emit(loanManager, "DepositSuperfluid")
        .withArgs(100);
      await increaseTime(hre, 7 * 24 * 3600);

      console.log({balance: await superToken.balanceOf(loanManager.address)});
    });
  });
});
