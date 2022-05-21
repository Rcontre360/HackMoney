import {Framework} from "@superfluid-finance/sdk-core";
import {BigNumberish, SignerWithAddress, Contract} from "ethers";

import {getNetworkConfig} from "@shared/utils/network";
import {attach} from "@shared/utils/contracts";
import {getProvider} from "..";

export const createFlow = async ({
  superToken,
  receiver,
  flowRate,
  sender,
  network,
}: {
  superToken: Contract;
  receiver: string;
  sender: SignerWithAddress;
  flowRate: BigNumberish;
  network: string;
}) => {
  const {address} = getNetworkConfig(network);
  const host = await attach("Superfluid", address.host);
  const cfa = await attach("ConstantFlowAgreementV1", address.cfa);
  const callData = cfa.interface.encodeFunctionData("createFlow", [
    superToken.address,
    receiver,
    flowRate,
    [],
  ]);
  const receipt = await host.connect(sender).callAgreement(address.cfa, callData, "0x");

  return receipt;
};

export const approveFlow = async ({
  manager,
  superToken,
  network,
}: {
  manager: string;
  superToken: Contract;
  network: string;
}) => {
  const {addresses} = getNetworkConfig(network);
  const host = await attach("Superfluid", addresses.host);
  const cfa = await attach("ConstantFlowAgreementV1", addresses.cfa);
  let callData: string = "";

  callData = cfa.interface.encodeFunctionData("authorizeFlowOperatorWithFullControl", [
    superToken.address,
    manager,
    [],
  ]);

  return await host.callAgreement(cfa, callData, "0x");
};

export const getFramework = async (network: string) => {
  const {addresses} = getNetworkConfig(network);
  const provider = getProvider();
  return await Framework.create({
    networkName: network,
    provider,
    resolverAddress: addresses.resolver,
  });
};
