import {task} from "hardhat/config";
import {writeJsonFile, loadJsonFile} from "@utils/index";
import {createSuperToken} from "@utils/superfluid";
import {deploy} from "@utils/contracts";
import {CreditScore} from "@sctypes/index";

task("deploy:oracle", "deploy oracle").setAction(async (taskArgs: Record<string, string>, hre) => {
  const {ethers, network} = hre;
  const accounts = await ethers.getSigners();
  const data = loadJsonFile(`/addresses.${network.name}.json`);

  const oracleContract = <CreditScore>await deploy(hre, "CreditScore", accounts[0], [data.link]);

  writeJsonFile({
    path: `/addresses.${network.name}.json`,
    data: {
      oracle: oracleContract.address,
    },
  });
});
