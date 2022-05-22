import React from "react";
import clsx from "clsx";
import Styles from "./styles.module.scss";
import Link from "next/link";

const TablePool = ({ body }) => {
  const headers = [
    "Principal Payment",
    "Re-Payment Amount",
    "Flow Rate",
    "Start Date",
    "Borrower",
    "Status",
  ];

  return (
    <>
      <div
        className={clsx(
          "overflow-x-auto my-4 w-full px-8",
          Styles.containerTable
        )}
      >
        <h2 className="text-left text-color1 mb-4 text-3xl">Loans</h2>
        <div className="overflow-x-auto w-full">
          <div className="align-middle inline-block w-full">
            <div className="shadow sm:rounded-lg w-full">
              <table className="w-full" cellSpacing="0" cellPadding="0">
                <thead className="border border-gray-300 rounded-md">
                  <tr>
                    {headers.map((head) => (
                      <th
                        scope="col"
                        className={clsx("p-4 text-md font-normal text-white")}
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
                        <td className="px-6 py-10 whitespace-nowrap text-white f-18">
                          {item.principal}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-white f-20 text-center">
                          {item.repaymentAmount}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                          {item.flowRate}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                          {item.startDate}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                          {item.borrower}
                        </td>
                        <td className="px-6 py-10 whitespace-nowrap text-white f-18 text-center">
                          {item.status}
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

export default TablePool;
