import {Contract, ContractTransaction, ethers} from "ethers";
import {ContractReceipt} from "@ethersproject/contracts";
import {LogDescription} from "@ethersproject/abi";

import {getProvider} from "..";
import abis from "./abis";

export function attach(contractName: keyof typeof abis, address: string, customProvider?: string) {
  const provider = getProvider(customProvider);
  return new ethers.Contract(
    address,
    abis[contractName].abi,
    customProvider ? provider : provider.getSigner()
  );
}

export const getLogs = (contract: Contract, transaction: ContractReceipt) => {
  const response: LogDescription[] = [];
  transaction.logs.forEach((log) => {
    try {
      if (log.address === contract.address) response.push(contract.interface.parseLog(log));
    } catch (err: any) {}
  });
  return response;
};

export const getReceipt = async (tx: Promise<ContractTransaction>) => await (await tx).wait();
