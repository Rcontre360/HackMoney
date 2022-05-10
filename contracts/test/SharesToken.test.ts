import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { SuperToken, SharesToken } from "@sctypes/index";
import {deploy} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {createFlow} from "@utils/superfluid";
import {getNetworkConfig} from "@utils/network";

hre.network.name = "mumbai"; //fork

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  sharesToken: SharesToken & SuperToken;
}

describe("SharesToken", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const {addresses} = await getNetworkConfig(hre.network.name);
    const initialSupply = ethers.utils.parseEther("100");
    const sharesToken = <SharesToken & SuperToken>await deploy(hre, "SharesToken", accounts[0], []);

    await sharesToken.initialize(
      "SharesToken",
      "SHT",
      addresses.superTokenFactory,
      initialSupply,
      accounts[0].address,
      "0x",
    );

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      sharesToken,
    };
  };

  describe("Initialization", () => {
    it("Should allow only minter to mint", async () => {
      const {sharesToken, user, other} = await loadFixture(fixture);
      const otherBalance = await sharesToken.balanceOf(other.address);
      const mintAmount = ethers.utils.parseEther("10");

      await mint(sharesToken as any, other, mintAmount);

      expect(otherBalance).to.be.equal("0");
      expect(await mint(sharesToken as any, other, mintAmount, other)).to.be.revertedWith("");
      expect(await sharesToken.balanceOf(other.address)).to.be.equal(mintAmount);
    });
  });

  describe("Basic money stream", () => {
    it("Should create a money stream", async () => {
      const {sharesToken, user, other} = await loadFixture(fixture);
      const flowRate = 1000;

      await createFlow(hre, {superToken: sharesToken, receiver: other, sender: user, flowRate});
    });
  });
});
