import {ethers} from "ethers";

export const getProvider = (provider?: string) => {
  return provider
    ? new ethers.providers.JsonRpcProvider(provider)
    : new ethers.providers.Web3Provider((window as any).ethereum);
};
