import {task} from "hardhat/config";
import {Framework} from "@superfluid-finance/sdk-core";

import {writeJsonFile, loadJsonFile} from "@utils/index";
import {attach, getLogs, getReceipt} from "@utils/contracts";

task("deploy:pool", "deploy lending protocol")
  .addParam("token", "superToken address")
  .setAction(async (taskArgs: Record<string, string>, hre) => {
    const {ethers, network} = hre;
    const {token} = taskArgs;
    const addresses = loadJsonFile(`/addresses.${network.name}.json`);

    const factory = await attach(hre, "ProtocolFactory", addresses.factory);

    const createLog = getLogs(factory, await getReceipt(factory.createLoanManagerAndPool(addresses.host, token))).find(
      ({name}) => name === "CreatedPortfolio",
    );
    console.log({
      pool: createLog?.args.pool,
      loanManager: createLog?.args.manager,
    });

    const lastId = await factory.portfolioId();
    const pools = new Array(lastId.sub(1)).fill(0).map((a, i) => factory.getPortfolio(i));

    writeJsonFile({
      path: `/addresses.${network.name}.json`,
      data: {
        pools: await Promise.all(pools),
      },
    });
  });
