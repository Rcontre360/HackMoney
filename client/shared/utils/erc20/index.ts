import {BigNumberish, Contract} from "ethers";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * approve `amount` tokens for `to` from `from`
 */
export const approve = async (
  token: Contract,
  toAddress: string,
  amount: BigNumberish
): Promise<void> => {
  return await token.approve(toAddress, amount);
};
