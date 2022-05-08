import { task } from "hardhat/config";
import { writeJsonFile } from "@utils/index";
import { deploy } from "@utils/contracts";
import { MockERC20, SuperTokenFactory } from "@sctypes/index";
import CONFIG from "@utils/constants";

task("deploySuperToken", "deploy superToken").setAction(async (taskArgs, hre) => {
  const { ethers, network } = hre;
  // const { protocol, fee } = taskArgs;
  const [owner] = await ethers.getSigners();

  const config = CONFIG[network.name as keyof typeof CONFIG];
  // const token = await (await ethers.getContractFactory("MockToken")).deploy();
  const token = <MockERC20>await deploy(hre, "MockERC20", owner, []);
  console.log("MockToken", token.address, config);

  const superTokenFactory = (await ethers.getContractFactory("SuperTokenFactory")).attach(config.superTokenFactory);

  const superTokenAddress = await superTokenFactory.callStatic["createERC20Wrapper"](
    token.address,
    1,
    "Super mock",
    "SMT",
  );
  await superTokenFactory["createERC20Wrapper"](token.address, 1, "Super mock", "SMT");

  writeJsonFile({
    path: `/addresses.${network.name}.json`,
    data: {
      token: token.address,
      superToken: superTokenAddress,
    },
  });
});
