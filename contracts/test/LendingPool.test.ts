import {expect} from "chai";
import hre, {waffle, ethers, web3} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {LendingPool, LoanManager} from "@sctypes/contracts";
import {MockERC20, SuperToken} from "@sctypes/index";
import {deploy, attach} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {deployEnvironment} from "@utils/superfluid";
import {createFlow, createSuperToken} from "@utils/superfluid";
import {getNetworkConfig} from "@utils/network";
import {Framework} from "@superfluid-finance/sdk-core";

const {loadFixture} = waffle;

const errorHandler = (err: Error) => {
  if (err) throw err;
};

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  superfluid: Framework;
}

describe("LendingPool", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const superfluid = await deployEnvironment(hre, accounts[0]);
    const token = <MockERC20>await deploy(hre, "MockERC20", accounts[0], []);
    const superToken = await createSuperToken(hre, {token, superfluid});
    //const lendingPool = <LendingPool>await deploy(hre,'LendingPool',accounts[0],[token.address])

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      superfluid,
    };
  };

  describe("Initialization", () => {
    it("Should do something", async () => {
      console.log("prev");
      await fixture();
      console.log("after");
    });
  });
});
