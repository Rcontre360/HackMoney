import {task} from "hardhat/config";
import {Framework} from "@superfluid-finance/sdk-core";

import {writeJsonFile, loadJsonFile} from "@utils/index";
import {createSuperToken} from "@utils/superfluid";
import {deploy} from "@utils/contracts";
import {LoanManager, LendingPool, ProtocolFactory} from "@sctypes/index";

task("deploy:protocol", "deploy lending protocol").setAction(async (taskArgs: Record<string, string>, hre) => {
  const {ethers, network} = hre;
  const accounts = await ethers.getSigners();

  const loanManagerImpl = <LoanManager>await deploy(hre, "LoanManager", accounts[0], []);
  console.log("loanManagerImpl", loanManagerImpl.address);

  const lendingPoolImpl = <LendingPool>await deploy(hre, "LendingPool", accounts[0], []);
  console.log("lendingPoolImpl", lendingPoolImpl.address);

  const factory = <ProtocolFactory>(
    await deploy(hre, "ProtocolFactory", accounts[0], [loanManagerImpl.address, lendingPoolImpl.address])
  );
  console.log("factory", factory.address);

  writeJsonFile({
    path: `/addresses.${network.name}.json`,
    data: {
      factory: factory.address,
      lendingPoolImpl: lendingPoolImpl.address,
      loanManagerImpl: loanManagerImpl.address,
    },
  });
});
