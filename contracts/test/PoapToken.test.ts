import { expect } from "chai";
import hre, { waffle, ethers } from "hardhat";
const { loadFixture } = waffle;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { POAPChainScore } from "@sctypes/index";
import { deploy } from "@utils/contracts";
import { LoanManagerInterface } from "@sctypes/contracts/LoanManager";
// import { mint } from "@utils/erc20";
// import { createFlow } from "@utils/superfluid";
// import { getNetworkConfig } from "@utils/network";

// hre.network.name = "mumbai"; //fork

interface TestContext {
  user: SignerWithAddress;
  other: SignerWithAddress;
  accounts: SignerWithAddress[];
  POAPToken: POAPChainScore;
}

type loanValues = "principal" | "flowRate" | "startDate" | "repaymentDuration" | "borrower" | "status";

describe("PoapToken", () => {
  const fixture = async (): Promise<TestContext> => {
    const accounts = await ethers.getSigners();
    const POAPToken = <POAPChainScore>await deploy(hre, "POAPChainScore", accounts[0], [""]);

    return {
      user: accounts[0],
      other: accounts[1],
      accounts,
      POAPToken,
    };
  };

  describe("Initialization", () => {
    it("Should set the loan data", async () => {
      const { POAPToken, user, other } = await loadFixture(fixture);
      const loanInput = {
        principal: 1,
        flowRate: 2,
        startDate: 100521,
        repaymentDuration: 100,
        borrower: user.address,
        status: 0,
      };
      await POAPToken.safeMint(other.address, loanInput, 0);
      const loanOutput = await POAPToken.getLoanData(0);
      Object.keys(loanInput).forEach((key: string, i: number) => {
        //@ts-ignore
        expect(loanOutput.toString().split(",")[i]).to.equal(loanInput[key].toString());
      });
    });
    it("Should allow only role minter to mint", async () => {
      const { POAPToken, user, other } = await loadFixture(fixture);
      const loanInput = {
        principal: 1,
        flowRate: 2,
        startDate: 100521,
        repaymentDuration: 100,
        borrower: user.address,
        status: 0,
      };
      await POAPToken.safeMint(other.address, loanInput, 0);
      const loanOutput = await POAPToken.getLoanData(0);
      Object.keys(loanInput).forEach((key: string, i: number) => {
        //@ts-ignore
        expect(loanOutput.toString().split(",")[i]).to.equal(loanInput[key].toString());
      });
      await expect(POAPToken.connect(other).safeMint(other.address, loanInput, 0)).to.be.reverted;
    });
  });
});
