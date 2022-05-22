import React from "react";
import clsx from "clsx";
import Styles from "./styles.module.scss";
import Link from "next/link";

export type PoolRow = {
  dao: string;
  pool: {value: string; id: number};
  token: string;
  tokens_symbol: string;
  tokens_saved: number;
  loan_created: number;
  token_usd: string;
  loan_manager: string;
};

const Table: React.FunctionComponent<{rows?: PoolRow[]}> = (props) => {
  const {rows} = props;
  const headers = [
    "DAO Name",
    "Pool",
    "Token Symbol",
    "Tokens Saved",
    "Loans Created",
    "Token/USD",
  ];

  return (
    <>
      <div className={clsx("overflow-x-auto my-4 w-full px-8", Styles.containerTable)}>
        <h2 className="text-left text-color1 mb-4 text-3xl">ChainScore Lending</h2>
        <div className="overflow-x-auto w-full">
          <div className="align-middle inline-block w-full">
            <div className="shadow sm:rounded-lg w-full">
              <table className="w-full" cellSpacing="0" cellPadding="0">
                <thead className="border border-gray-300 rounded-md">
                  <tr>
                    {headers.map((head) => (
                      <th scope="col" className={clsx("p-4 text-md font-normal text-white")}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="border border-gray-300 rounded-md">
                  {Array.isArray(rows) &&
                    rows.map((item, i) => {
                      return (
                        <tr className="border border-gray-300">
                          <td className="px-6 py-10 whitespace-nowrap text-white f-18">
                            {item.dao}
                          </td>
                          <td className="px-6 py-10 whitespace-nowrap text-color1 f-20 text-center">
                            <Link
                              href={`/app/pool/${item.pool.value}?factoryId=${item.pool.id}&tokens_symbol=${item.tokens_symbol}&tokens_saved=${item.tokens_saved}&tokens_usd=${item.token_usd}&loan_created=${item.loan_created}&dao=${item.dao}&loan_manager=${item.loan_manager}&token=${item.token}`}
                              className="whitespace-nowrap"
                            >
                              {item.pool.value}
                            </Link>
                          </td>
                          <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                            {item.tokens_symbol}
                          </td>
                          <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                            {item.tokens_saved}
                          </td>
                          <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                            {item.loan_created}
                          </td>
                          <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                            {item.token_usd}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
