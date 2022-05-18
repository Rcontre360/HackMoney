import {expect} from "chai";
import {Artifact, HardhatRuntimeEnvironment} from "hardhat/types";
import {BigNumber, Contract, Signer, ContractTransaction, ContractFactory} from "ethers";
import {ContractReceipt} from "@ethersproject/contracts";
import {LogDescription} from "@ethersproject/abi";

export async function deploy<T extends Contract>(
  hardhat: HardhatRuntimeEnvironment,
  contractName: string,
  deployer: Signer,
  params: any[],
): Promise<T> {
  const {deployContract} = hardhat.waffle;
  const artifact: Artifact = await hardhat.artifacts.readArtifact(contractName);
  return <T>await deployContract(deployer, artifact, params);
}

export async function attach<T extends Contract>(
  hardhat: HardhatRuntimeEnvironment,
  contractName: string,
  address: string,
): Promise<T> {
  const {ethers} = hardhat;
  return <T>(await ethers.getContractFactory(contractName)).attach(address);
}

export const getLogs = (contract: Contract, transaction: ContractReceipt) => {
  const response: LogDescription[] = [];
  transaction.logs.forEach(log => {
    try {
      if (log.address === contract.address) response.push(contract.interface.parseLog(log));
    } catch (err: any) {}
  });
  return response;
};

export const expectLogs = (logs: LogDescription[], logName: string, args: (string | BigNumber)[][]) => {
  const bigNumberParser = (a: string | BigNumber) => (typeof a === "object" ? a.toString() : a);
  const matchLogs = logs.filter(lg => lg.name === logName);

  expect(matchLogs.length === args.length, "ExpectLogs: logs amount mismatch");
  matchLogs.forEach((lg, i) => {
    const logArgs = lg.args.map(bigNumberParser);
    expect(logArgs).to.eql(args[i].map(bigNumberParser), "ExpectLogs: unexpected log value");
  });
};

export const getReceipt = async (tx: Promise<ContractTransaction>) => await (await tx).wait();

export async function deployBehindProxy<T extends ContractFactory>(
  hre: HardhatRuntimeEnvironment,
  implName: string,
  args: any[],
): Promise<ReturnType<T["deploy"]>> {
  const factory = await hre.ethers.getContractFactory(implName);
  const impl = await factory.deploy();
  const init = (await impl.populateTransaction.initialize(...args)).data;
  const proxy = await (await hre.ethers.getContractFactory("ERC1967Proxy")).deploy(impl.address, init);
  const instance = factory.attach(proxy.address);
  return instance;
}
