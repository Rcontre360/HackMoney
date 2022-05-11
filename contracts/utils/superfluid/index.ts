import {expect} from "chai";
import {Framework} from "@superfluid-finance/sdk-core";
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

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");

export const createFlow = async (
  hre: HardhatRuntimeEnvironment,
  {
    superToken,
    receiver,
    flowRate,
    sender,
    superfluid,
  }: {
    superToken: SuperToken;
    receiver: SignerWithAddress | string;
    sender: SignerWithAddress;
    flowRate: BigNumberish;
    superfluid: Framework;
  },
) => {
  const {
    cfaV1: {address: cfaAddress},
    host: {address: hostAddress},
  } = superfluid.contracts;
  const host = <Superfluid>await attach(hre, "Superfluid", hostAddress);
  const cfa = <ConstantFlowAgreementV1>await attach(hre, "ConstantFlowAgreementV1", cfaAddress);

  const finalReceiver = typeof receiver === "string" ? receiver : receiver.address;
  const callData = cfa.interface.encodeFunctionData("createFlow", [superToken.address, finalReceiver, flowRate, []]);

  const receipt = await host.connect(sender).callAgreement(cfaAddress, callData, "0x");
  const flow = await cfa.getFlow(superToken.address, sender.address, finalReceiver);

  expect(flow.flowRate, "Flow not created").to.be.equal(flowRate);

  return receipt;
};

export const approveFlow = async (
  hre: HardhatRuntimeEnvironment,
  {
    sender,
    manager,
    superToken,
    flowRate,
    superfluid,
  }: {
    sender: SignerWithAddress;
    manager: string;
    superToken: SuperToken;
    flowRate: BigNumberish;
    superfluid: Framework;
  },
) => {
  const {
    cfaV1: {address: cfaAddress},
    host: {address: hostAddress},
  } = superfluid.contracts;
  const host = <Superfluid>await attach(hre, "Superfluid", hostAddress);
  const cfa = <ConstantFlowAgreementV1>await attach(hre, "ConstantFlowAgreementV1", cfaAddress);
  let callData: string = "";

  if (flowRate > 0)
    callData = cfa.interface.encodeFunctionData("updateFlowOperatorPermissions", [
      superToken.address,
      manager,
      1,
      flowRate,
      [],
    ]);
  else
    callData = cfa.interface.encodeFunctionData("authorizeFlowOperatorWithFullControl", [
      superToken.address,
      manager,
      [],
    ]);

  const receipt = await host.connect(sender).callAgreement(cfaAddress, callData, "0x");
  return receipt;
};

export const upgradeToken = async ({
  token,
  superToken,
  amount,
}: {
  token: MockERC20;
  superToken: SuperToken;
  amount: BigNumberish;
}) => {
  await token.approve(superToken.address, amount);
  await superToken.upgrade(amount);
};

export const createSuperToken = async (
  hre: HardhatRuntimeEnvironment,
  {token, superfluid}: {token: MockERC20; superfluid: Framework},
) => {
  const {
    host: {address: hostAddress},
  } = superfluid.contracts;

  const host = <Superfluid>await attach(hre, "Superfluid", hostAddress);
  const superTokenFactory = <SuperTokenFactory>(
    await attach(hre, "SuperTokenFactory", await host.getSuperTokenFactory())
  );
  const superTokenAddress = await superTokenFactory.callStatic["createERC20Wrapper(address,uint8,string,string)"](
    token.address,
    1,
    "Super mock",
    "SMT",
  );

  await superTokenFactory["createERC20Wrapper(address,uint8,string,string)"](token.address, 1, "Super mock", "SMT");
  return <SuperToken>await attach(hre, "SuperToken", superTokenAddress);
};

export const deployEnvironment = async (hre: HardhatRuntimeEnvironment, signer: SignerWithAddress) => {
  const errorHandler = (err: Error) => {
    if (err) throw err;
  };

  await deployFramework(errorHandler, {
    web3: hre.web3,
    from: signer.address,
  });

  const sf = await Framework.create({
    networkName: "custom",
    provider: hre.ethers,
    dataMode: "WEB3_ONLY",
    resolverAddress: process.env.TEST_RESOLVER, //this is how you get the resolver address
    protocolReleaseVersion: "test",
  });

  return sf;
};
