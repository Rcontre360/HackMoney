import {task} from "hardhat/config";
import {Framework} from "@superfluid-finance/sdk-core";

import {writeJsonFile, loadJsonFile} from "@utils/index";
import {deploy, attach, getReceipt, getLogs} from "@utils/contracts";
import {MockERC20, SuperTokenFactory} from "@sctypes/index";

task("deploy:token", "deploy superToken").setAction(async (taskArgs, hre) => {
  const {ethers, network} = hre;
  const addresses = loadJsonFile(`/addresses.${network.name}.json`);

  const token = <MockERC20>await deploy(hre, "MockERC20", (await ethers.getSigners())[0], []);
  const superTokenFactory = <SuperTokenFactory>(
    await attach(hre, "SuperTokenFactory", "0x200657E2f123761662567A1744f9ACAe50dF47E6") //hardcoded mumbai
  );
  const log = getLogs(
    superTokenFactory,
    await getReceipt(
      superTokenFactory["createERC20Wrapper(address,uint8,string,string)"](token.address, 1, "Super mock", "SMT"),
    ),
  ).find(({name}) => name === "SuperTokenCreated");
  const tokenContract = <MockERC20>await deploy(hre, "MockERC20", (await ethers.getSigners())[0], []);

  writeJsonFile({
    path: `/addresses.${network.name}.json`,
    data: {
      token: addresses.tokens ? addresses.tokens.push(tokenContract.address) : [tokenContract.address],
      superTokens: addresses.superTokens ? addresses.superTokens.push(log?.args.token) : [log?.args.token],
    },
  });
});
