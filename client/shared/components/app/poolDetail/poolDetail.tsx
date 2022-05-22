import React from "react";
import {useRouter} from "next/router";
import Table from "../table/table";
import TablePool from "../table/tablePool";
import {Button} from "@shared/components/common/button/button";
import clsx from "clsx";

import {attach} from "@shared/utils/contracts";

const PoolDetailComponent: React.FunctionComponent<{}> = () => {
  const [rows, setRows] = React.useState<any[]>([]);
  const {query} = useRouter();

  const poolDetail = {
    name: `Pool #${query.factoryId}`,
    id: query.factoryId,
    contract: {
      value: query.id,
      title: "Contract Address",
    },
    fields: [
      {value: Number(query.tokens_saved) * Number(query.tokens_usd), title: "Value (USD)"},
      {value: query.tokens_symbol, title: "Pool Token"},
    ],
  };

  const getRows = async () => {
    const manager = attach(
      "LoanManager",
      query.loan_manager as string,
      process.env.NEXT_PUBLIC_MUMBAI_PROVIDER
    ); //TODO hardcoded mumbai
    const numLoans = await manager.loanId();
    const loans = await Promise.all(
      new Array(numLoans.toNumber()).fill(0).map((a, i) => manager.loans(i))
    );

    setRows(
      loans.map((loan) => ({
        principal: loan.principal.toString(),
        flowRate: `${loan.flowRate.toString()}/second`,
        repaymentAmount: loan.repaymentAmount.toString(),
        startDate: new Date(loan.startDate * 1000).toLocaleString(),
        status: loan.status == 0 ? "Issued" : loan.status == 1 ? "Paid" : "Defaulted",
        borrower: loan.borrower,
      }))
    );
  };

  React.useEffect(() => {
    getRows();
  }, []);

  return (
    <div className="flex flex-col items-center bg-color2 min-h-screen px-16 pt-8">
      <div className="flex w-full justify-between">
        <h1 className="text-white f-48">{poolDetail.name}</h1>
        <Button
          href={`/app/poolForm/${poolDetail.contract.value}?token=${query.token}`}
          className={clsx("font-bold w-min whitespace-nowrap w-full")}
        >
          Propose a loan
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-between pb-6">
          <div className="flex flex-col items-center w-full justify-center gap-2">
            <h2 className="text-color1 f-24">{poolDetail.contract.title}</h2>
            <p className="text-white f-16">{poolDetail.contract.value}</p>
          </div>
        </div>
        <div className="flex flex-wrap w-full justify-between">
          {poolDetail.fields.map((field, i) => {
            return (
              <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-color1 f-24">{field.title}</h2>
                <p className="text-white f-16">{field.value}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full text-center">
        <TablePool body={rows} />
      </div>
    </div>
  );
};

export default PoolDetailComponent;
