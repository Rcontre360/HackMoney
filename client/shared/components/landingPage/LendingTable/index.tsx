import React from "react";
import { TABLE_BODY, TABLE_HEADER } from "../../../../constants";

const LendingTable = () => {
  const headers = TABLE_HEADER;
  const body = TABLE_BODY;

  return (
    <div className="mx-10">
      <h2 className="text-left text-color1 mb-4 text-3xl">
        ChainScore Lending
      </h2>

      <table className="table w-full" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th
                key={i}
                className="p-4 text-md font-normal text-gray-600 text-center"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((item, i) => (
            <tr key={i} className="border-b border-gray-300 text-center hover">
              <td className="px-6 py-10 whitespace-nowrap f-18">{item.dao}</td>
              <td className="px-6 py-10 whitespace-nowrap text-color1 f-20 text-center">
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LendingTable;
