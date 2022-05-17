import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {CreditScore} from "@sctypes/index";
import {deploy, getReceipt, getLogs} from "@utils/contracts";

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  creditScore: CreditScore;
}

describe.only("CreditScore", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const creditScore = <CreditScore>await deploy(hre, "CreditScore", accounts[0], []);

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      creditScore,
    };
  };

  describe("Initialization", () => {
    it("Should make request", async () => {
      const {creditScore} = await loadFixture(fixture);

      //const logs = getLogs(
      //creditScore,
      //await getReceipt(creditScore.testBytes(ethers.utils.arrayify("f7a5b18d-c9fb-4003-94fc-8d290aeb8e14"))),
      //);
      //console.log(logs);
    });
  });
});
