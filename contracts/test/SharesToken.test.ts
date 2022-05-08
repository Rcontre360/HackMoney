import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {SharesToken} from "@sctypes/contracts";
import {deploy} from "@utils/contracts";

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  sharesToken: SharesToken;
}

describe("SharesToken", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const protocolAccount = accounts[2];
    const sharesToken = <SharesToken>await deploy(hre, "SharesToken", accounts[0], [protocolAccount.address]);

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      sharesToken,
    };
  };

  describe("Initialization", () => {});
});
