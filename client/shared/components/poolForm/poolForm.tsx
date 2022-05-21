import * as React from "react";
import { Button } from "../common/button";
import { InputText } from "../common/form/input-text";
// import { InputEmail } from "../common/form/input-email";
import getWeb3 from "../../getWeb3";
import clsx from "clsx";
import Styles from "./styles.module.scss";
import { SelectInputForm } from "../common/form/select/SelectInputForm";
import { InputDatePicker } from "../common/form/input-datepicker";

import { createLoan } from "@shared/utils/protocol";

export const PoolFormComponent: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingWallet, setIsLoadingWallet] = React.useState<boolean>(false);
  const [web3, setWeb3] = React.useState(null);
  const [accounts, setAccounts] = React.useState(null);
  const [data, setData] = React.useState({
    principal: "",
    repaymentAmount: "",
    frequency: "",
    borrower: "",
  });
  const [loanEndDate, setLoanEndDate] = React.useState("");

  React.useEffect(() => {
    console.log(data, loanEndDate);
  }, [data, loanEndDate]);

  const onSubmit = async () => {
    setIsLoading(true);
  };

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
      //setContract(contract);
      setAccounts(accounts);
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

  return (
    <div
      className={clsx(
        "relative w-full flex flex-col items-center justify-center pt-20 min-h-screen"
      )}
    >
      <div
        className={clsx(
          "relative flex sm:flex-row items-start justify-between "
        )}
      >
        <div className={clsx("bg-gray-4 rounded-10 shadow-generic")}>
          <div className={clsx("w-full")}>
            <div className="  ">
              <div>
                <h4
                  className={clsx(
                    "f-24 text-center text-color1 font-bold mb-2"
                  )}
                >
                  Create Loan Detail
                </h4>
              </div>

              {(accounts == null || accounts.length === 0) && !isLoadingWallet && (
                <div className={clsx("flex justify-center mb-2")}>
                  <Button
                    labelProps={clsx("font-bold")}
                    label={"Connect Wallet"}
                    onClick={
                      isLoadingWallet
                        ? undefined
                        : () => {
                            connectWallet();
                          }
                    }
                    // type="submit"
                    disabled={isLoadingWallet}
                  />
                </div>
              )}
              <form className="w-80">
                <InputText
                  name="fullName"
                  placeholder="Borrower *"
                  className={clsx("font-bold")}
                  // title={"Borrower"}
                  // value={data.borrower}
                  // onChange={(e) => addField("borrower", e.target.value)}
                  readOnly
                  value={
                    accounts !== null && accounts.length !== 0
                      ? accounts[0]
                      : ""
                  }
                />
                <InputText
                  type="number"
                  name="payment"
                  placeholder="Principal amount"
                  onChangeCustom={(e) =>
                    setData({ ...data, principal: e.target.value })
                  }
                  // title={"Payment Amount (ETH)"}
                  className={clsx("font-bold")}
                />
                <InputText
                  type="number"
                  name="repayment"
                  placeholder="Re-Payment Amount (ETH)"
                  onChangeCustom={(e) =>
                    setData({ ...data, repaymentAmount: e.target.value })
                  }
                  // title={"Re-Payment Amount (ETH)"}
                  className={clsx("font-bold")}
                />

                <SelectInputForm
                  arrayValues={[
                    { value: "per_day", title: "Per Day" },
                    { value: "per_week", title: "Per Week" },
                    { value: "per_month", title: "Per Month" },
                    { value: "per_year", title: "Per Year" },
                  ]}
                  type="number"
                  name="paymentFrequency"
                  title="Payment Frequency"
                  // title={"Payment Frequency"}
                  // labelVisible
                  onChangeCustom={(e) =>
                    setData({ ...data, frequency: e.target.value })
                  }
                  className={clsx("font-bold")}
                />
                <InputDatePicker
                  name="endDate"
                  placeholder="Loan End Date"
                  // title={"Loan End Date"}
                  setValues={setLoanEndDate}
                  value={loanEndDate}
                  className={clsx("font-bold")}
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
