import {task} from "hardhat/config";
import {writeJsonFile} from "@utils/index";
import {createSuperToken} from "@utils/superfluid";

task("deploySuperToken", "deploy superToken")
  .addParam("token", "base token")
  .setAction(async (taskArgs, hre) => {
    const {ethers, network} = hre;
    const {token} = taskArgs;

    const superToken = await createSuperToken(hre, {baseToken: token});

    writeJsonFile({
      path: `/addresses.${network.name}.json`,
      data: {
        token: token.address,
        superToken: superToken.address,
      },
    });
  });
