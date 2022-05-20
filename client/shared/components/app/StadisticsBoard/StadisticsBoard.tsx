import React from "react";
import clsx from "clsx";
import Styles from "./styles.module.scss";

export const StadisticsBoard = () => {
  const stats = [
    {
      title: "Total Value Locked",
      stat: { value: "5.4 K", subvalue: "USD" },
    },
    {
      title: "Total DAOS",
      stat: { value: "5", subvalue: "DAOS" },
    },
    {
      title: "Total Loans Created",
      stat: { value: "400", subvalue: "LOANS" },
    },
  ];
  return (
    <div className="flex flex-wrap items-center justify-start gap-10 w-full my-10 px-10">
      {stats.map((item, i) => {
        return <StatBox title={item.title} stat={item.stat} />;
      })}
    </div>
  );
};

const StatBox = ({ title, stat }) => {
  return (
    <div className="p-4 rounded-md border border-gray-300 flex flex-col w-56">
      <div className="f-20 text-primary">{title}</div>
      <div className="flex gap-1 items-end">
        <div className="f-18 font-normal">{stat.value}</div>
        <div className="f-18 font-thin">{stat.subvalue}</div>
      </div>
    </div>
  );
};
