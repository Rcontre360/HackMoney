import { ethers, network } from "hardhat";
import { writeJsonFile } from "../utils";
import CONFIG from "../utils/constants";

async function main(): Promise<void> {
  const config = CONFIG[network.name as keyof typeof CONFIG];
  const token = await (await ethers.getContractFactory("MockToken")).deploy();
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
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
