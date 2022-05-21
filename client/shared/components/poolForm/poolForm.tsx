import * as React from "react";
import {Button} from "../common/button";
import {InputText} from "../common/form/input-text";
// import { InputEmail } from "../common/form/input-email";
import getWeb3 from "../../getWeb3";
import clsx from "clsx";
import Styles from "./styles.module.scss";
import {SelectInputForm} from "../common/form/select/SelectInputForm";

import {createLoan} from "@shared/utils/protocol";

export const PoolFormComponent: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingWallet, setIsLoadingWallet] = React.useState<boolean>(false);
  const [web3, setWeb3] = React.useState(null);
  const [accounts, setAccounts] = React.useState(null);
  const [data, setData] = React.useState({
    principal: "",
    repaymentAmount: "",
    frequecy: "",
    borrower: "",
  });

  const onSubmit = async () => {
    const loan = {
      ...data,
      pool: "",
      flowRate: 0,
    };
    //await createLoan(loan,)
  };

  const addField = (key: keyof typeof data, value: string) => {};

  const connectWallet = async () => {
    setIsLoadingWallet(true);
    try {
      // Use web3 to get the user's accounts.
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      // Update State
      setWeb3(web3);
      accounts.push(accounts[0]);
      accounts[0] = (window as any).ethereum.selectedAddress;
      setAccounts(accounts);

      addField("borrower", accounts[0]);
      setIsLoadingWallet(false);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details or check Metamask.`
      );
      console.error(error);
      setIsLoadingWallet(false);
    }
  };

  React.useEffect(() => {
    connectWallet();
  });

  return (
    <div
      className={clsx(
        "relative w-full flex flex-col items-center justify-center pt-20 min-h-screen"
      )}
    >
      <div className={clsx("relative flex sm:flex-row items-start justify-between ")}>
        <div className={clsx("bg-gray-4 rounded-10 shadow-generic")}>
          <div className={clsx("w-full")}>
            <div className="  ">
              <div>
                <h4 className={clsx("f-24 text-center text-color1 font-bold mb-2")}>
                  Create Loan Detail
                </h4>
              </div>

              <form className="w-80">
                <InputText
                  name="fullName"
                  placeholder="Borrower *"
                  className={clsx("font-bold")}
                  // title={"Borrower"}
                  readOnly
                  value={data.borrower}
                  onChange={(e) => addField("borrower", e.target.value)}
                />

                <InputText
                  type="number"
                  name="repayment"
                  placeholder="Principal amount"
                  // title={"Re-Payment Amount (ETH)"}
                  className={clsx("font-bold")}
                  value={data.principal}
                  onChange={(e) => addField("principal", e.target.value)}
                />

                <InputText
                  type="number"
                  name="payment"
                  placeholder="Repayment amount"
                  // title={"Payment Amount (ETH)"}
                  className={clsx("font-bold")}
                  value={data.repaymentAmount}
                  onChange={(e) => addField("repaymentAmount", e.target.value)}
                />

                <SelectInputForm
                  arrayValues={[
                    {value: "per_day", title: "Per Day"},
                    {value: "per_week", title: "Per Week"},
                    {value: "per_month", title: "Per Month"},
                    {value: "per_year", title: "Per Year"},
                  ]}
                  type="number"
                  name="paymentFrequency"
                  title="Payment Frequency"
                  // title={"Payment Frequency"}
                  // labelVisible
                  className={clsx("font-bold")}
                  value={data.frequecy}
                  onChange={(e) => addField("frequecy", e.target.value)}
                />
                <div className={clsx("flex justify-center ")}>
                  <Button
                    labelProps={clsx("font-bold")}
                    label={isLoading ? "Loading" : "Send"}
                    onClick={
                      isLoading
                        ? undefined
                        : () => {
                          onSubmit();
                        }
                    }
                    // type="submit"
                    disabled={isLoading}
                    onClick={onSubmit}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
