import {HardhatRuntimeEnvironment} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumberish} from "ethers";

import {Superfluid} from "@sctypes/index";
import {ConstantFlowAgreementV1} from "@sctypes/index";
import {SuperTokenFactory} from "@sctypes/index";
import {SuperToken} from "@sctypes/index";

import {getNetworkConfig} from "@utils/network";
import {attach} from "@utils/contracts";
import {MockERC20} from "@sctypes/index";

export const createFlow = async (
  hardhat: HardhatRuntimeEnvironment,
  {
    superToken,
    receiver,
    flowRate,
    sender,
  }: {superToken: SuperToken; receiver: SignerWithAddress; sender: SignerWithAddress; flowRate: BigNumberish},
) => {
  const {network} = hardhat;
  const {addresses} = getNetworkConfig(network.name as any) as any;
  const host = <Superfluid>await attach(hardhat, "Superfluid", addresses.host);
  const cfa = <ConstantFlowAgreementV1>await attach(hardhat, "ConstantFlowAgreementV1", addresses.cfa);
  const callData = cfa.interface.encodeFunctionData("createFlow", [superToken.address, receiver.address, flowRate, []]);

  const receipt = await host.connect(sender).callAgreement(addresses.cfa, callData, [], {gasLimit: 3000000});
  return receipt;
};

export const upgradeToken = async (
  hardhat: HardhatRuntimeEnvironment,
  {token, superToken, amount}: {token: string; superToken: string; amount: string},
) => {
  const superTkn = <SuperToken>await attach(hardhat, "MockSuperToken", superToken);
  const tkn = <MockERC20>await attach(hardhat, "MockToken", token);

  await tkn.approve(superToken, amount);
  await superTkn.upgrade(amount);
};

export const createSuperToken = async (hardhat: HardhatRuntimeEnvironment, {baseToken}: {baseToken: string}) => {
  const {network} = hardhat;
  const {addresses} = getNetworkConfig(network.name as any) as any;
  const superTokenFactory = <SuperTokenFactory>(
    await attach(hardhat, "MockSuperTokenFactory", addresses.superTokenFactory)
  );
  const superTokenAddress = await superTokenFactory.callStatic["createERC20Wrapper(address,uint8,string,string)"](
    baseToken,
    1,
    "Super mock",
    "SMT",
  );

  await superTokenFactory["createERC20Wrapper(address,uint8,string,string)"](baseToken, 1, "Super mock", "SMT");

  return <SuperToken>await attach(hardhat, "SuperToken", superTokenAddress);
};
