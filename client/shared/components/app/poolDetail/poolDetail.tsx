import React from "react";
import Table from "../table/table";
import TablePool from "../table/tablePool";

const PoolDetailComponent: React.FunctionComponent<{}> = () => {
  const poolDetail = {
    name: "Pool1",
    contract: {
      value: "0x7A56a078da312bbfB5916CE118786f39cf6DF74z",
      title: "Contract Address",
    },
    fields: [
      { value: "10000", title: "Value (USD)" },
      { value: "TKN", title: "Pool Token" },
    ],
  };

  const body = [
    {
      principal: "1000",
      repaymentAmount: 15000,
      flowRate: "100 / month",
      startDate: "2022/21/05",
      borrower: "0x11255031BdD1AC96C4FC5B1274e3E9ba6166b358",
      status: "waiting for payment",
    },
    {
      principal: "1000",
      repaymentAmount: 15000,
      flowRate: "100 / month",
      startDate: "2022/21/05",
      borrower: "0x11255031BdD1AC96C4FC5B1274e3E9ba6166b358",
      status: "waiting for payment",
    },
    {
      principal: "1000",
      repaymentAmount: 15000,
      flowRate: "100 / month",
      startDate: "2022/21/05",
      borrower: "0x11255031BdD1AC96C4FC5B1274e3E9ba6166b358",
      status: "waiting for payment",
    },
    {
      principal: "1000",
      repaymentAmount: 15000,
      flowRate: "100 / month",
      startDate: "2022/21/05",
      borrower: "0x11255031BdD1AC96C4FC5B1274e3E9ba6166b358",
      status: "waiting for payment",
    },
  ];
  return (
    <div className="flex flex-col items-center bg-color2 min-h-screen px-16 pt-8">
      <div className="flex w-full">
        <h1 className="text-white f-48">{poolDetail.name}</h1>
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
        <TablePool body={body} />
      </div>
    </div>
  );
};

export default PoolDetailComponent;
