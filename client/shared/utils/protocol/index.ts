import ethers, {BigNumberish} from "ethers";

import {getNetworkConfig} from "@shared/utils/network";
import {attach, getLogs, getReceipt} from "@shared/utils/contracts";

export const createLendingPool = async (network: string, token: string) => {
  const {addresses} = getNetworkConfig(network);
  const factory = await attach("ProtocolFactory", addresses.factory);

  const createLog = getLogs(
    factory,
    await getReceipt(factory.createLoanManagerAndPool(addresses.host, token))
  ).find(({name}) => name === "CreatedPortfolio");

  return {
    pool: createLog.args.pool,
    loanManager: createLog.args.manager,
  };
};

export const depositFromDao = async (amount: BigNumberish, pool: string) => {
  const lendingPool = await attach("LendingPool", pool);
  const superToken = await attach("ERC20", await lendingPool.token());

  await superToken.approve(lendingPool.address, amount);
  await lendingPool.deposit(amount);
};

export type Loan = {
  principal: BigNumberish;
  flowRate: BigNumberish;
  repaymentAmount: BigNumberish;
  borrower: string;
  pool: string;
};
export const createLoan = async (loan: Loan, network?: string) => {
  const {addresses} = getNetworkConfig(network);
  console.log(addresses);
  const host = await attach("Superfluid", addresses.host);
  const cfa = await attach("ConstantFlowAgreementV1", addresses.cfa);
  const lendingPool = await attach("LendingPool", loan.pool);

  return await host.callAgreement(
    cfa.address,
    cfa.interface.encodeFunctionData("createFlowByOperator", [
      await lendingPool.token(),
      loan.borrower,
      lendingPool.address,
      loan.flowRate,
      [],
    ]),
    ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "uint256"],
      [loan.borrower, loan.repaymentAmount, loan.principal]
    )
  );
};

//TODO add allowance of flowRate to loan
export const giveLoanAllowance = async (
  loanId: BigNumberish,
  allowedFlowRate: BigNumberish,
  pool: string
) => {};

//TODO change flowRate of given loan
export const changeLoanFlowRate = async (
  loanId: BigNumberish,
  allowedFlowRate: BigNumberish,
  pool: string
) => {};
