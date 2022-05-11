import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {SharesToken} from "@sctypes/contracts";
import {SuperToken} from "@sctypes/index";
import {deploy, attach} from "@utils/contracts";
import {mint} from "@utils/erc20";
import {createFlow, deployEnvironment} from "@utils/superfluid";
import {getNetworkConfig} from "@utils/network";

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  //sharesToken: SuperToken;
  proxy: SharesToken;
}

describe("SharesToken", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const initialSupply = ethers.utils.parseEther("100");
    const proxy = <SharesToken>await deploy(hre, "SharesToken", accounts[0], []);
    const superfluid = await deployEnvironment(hre, accounts[0]);

    //await proxy.initialize("SharesToken", "SHT", superfluid.contracts., initialSupply, accounts[0].address, "0x");
    //await proxy.grantRole(await proxy.MINTER_ROLE(), accounts[0].address);
    //const sharesToken = <SuperToken>await attach(hre, "SuperToken", proxy.address);

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      //sharesToken,
      proxy,
    };
  };

  describe("Initialization", () => {
    it("Should allow only minter to mint", async () => {
      //const {sharesToken, proxy, user, other} = await loadFixture(fixture);
      //const otherBalance = await sharesToken.balanceOf(other.address);
      //const mintAmount = ethers.utils.parseEther("10");
      //await expect(proxy.mint(other.address, mintAmount, [])).to.emit(sharesToken, "Transfer");
      //const postBalance = await sharesToken.balanceOf(other.address);
      //expect(postBalance.sub(otherBalance)).to.equal(mintAmount);
      //expect(otherBalance).to.be.equal("0");
      //expect(await sharesToken.balanceOf(other.address)).to.be.equal(mintAmount);
      //await expect(proxy.connect(other).mint(other.address, mintAmount, [])).to.be.revertedWith("");
    });
  });

  describe("Basic money stream", () => {
    it("Should create a money stream", async () => {
      //const {sharesToken, user, other} = await loadFixture(fixture);
      const flowRate = 1000;

      //await createFlow(hre, {superToken: sharesToken, receiver: other, sender: user, flowRate});
    });
  });
});
