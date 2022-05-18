import React from "react";
import clsx from "clsx";
import Styles from "./styles.module.scss";

const Table = () => {
  const headers = [
    "DAO Name",
    "Pool",
    "Token Symbol",
    "Tokens Saved",
    "Loans Created",
    "Token/USD",
  ];

  const body = [
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: 40000,
      loan_created: 450,
      token_usd: "320USD",
    },
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: 40000,
      loan_created: 450,
      token_usd: "320USD",
    },
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: 40000,
      loan_created: 450,
      token_usd: "320USD",
    },
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: "DAO1TK",
      loan_created: 450,
      token_usd: "320USD",
    },
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: 40000,
      loan_created: 450,
      token_usd: "320USD",
    },
    {
      dao: "Dao1",
      pool: { value: "Pool1", id: 1 },
      tokens_symbol: "DAO1TK",
      tokens_saved: 40000,
      loan_created: 450,
      token_usd: "320USD",
    },
  ];
  return (
    <>
      <div
        className={clsx(
          "overflow-x-auto my-4 w-full px-8",
          Styles.containerTable
        )}
      >
        <h2 className="text-left text-primary mb-4 text-3xl">
          ChainScore Lending
        </h2>
        <div className="overflow-x-auto w-full">
          <div className="align-middle inline-block w-full">
            <div className="shadow sm:rounded-lg w-full">
              <table className="w-full" cellSpacing="0" cellPadding="0">
                <thead className="border border-gray-300 rounded-md">
                  <tr>
                    {headers.map((head) => (
                      <th
                        scope="col"
                        className={clsx(
                          "p-4 text-md font-normal text-gray-600"
                        )}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="border border-gray-300 rounded-md">
                  {body.map((item, i) => {
                    return (
                      <tr className="border border-gray-300">
                        <td className="px-6 py-10 whitespace-nowrap f-18">
                          {item.dao}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-primary f-20 text-center">
                          <a
                            href={`/poolForm/${item.pool.id}`}
                            className="whitespace-nowrap"
                          >
                            {item.pool.value}
                          </a>
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap f-18 text-center">
                          {item.tokens_symbol}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap f-18 text-center">
                          {item.tokens_saved}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap f-18 text-center">
                          {item.loan_created}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap f-18 text-center">
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
