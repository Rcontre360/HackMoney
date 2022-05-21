import {ethers} from "ethers";

export const getProvider = (provider?: string) => {
  return new ethers.providers.Web3Provider(provider ? provider : (window as any).ethereum);
};
