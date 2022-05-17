import {task} from "hardhat/config";
import {writeJsonFile} from "@utils/index";
import {createSuperToken} from "@utils/superfluid";
import {attach} from "@utils/contracts";
import {MockERC20} from "@sctypes/index";

task("deploySuperToken", "deploy superToken")
  .addParam("token", "base token")
  .setAction(async (taskArgs, hre) => {
    const {ethers, network} = hre;
    const {token} = taskArgs;

    const tokenContract = <MockERC20>await attach(hre, "MockERC20", token);
    //const superToken = await createSuperToken(hre, {token: tokenContract,});

    //writeJsonFile({
    //path: `/addresses.${network.name}.json`,
    //data: {
    //token: token.address,
    //superToken: superToken.address,
    //},
    //});
  });
