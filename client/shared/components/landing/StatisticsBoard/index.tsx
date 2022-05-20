import React from "react";
import {STATS} from '../../../../constants';

export const StatisticsBoard = () => {
  const stats = STATS;
  return (
    <div className="flex flex-wrap items-center w-full my-10 px-10 justify-between">
      {stats.map((item, i) => (
        <div className="stats shadow w-1/5" key={i}>
          <div className="stat flex flex-col items-center">
            <div className="text-color1 stat-title f-20">{item.title}</div>
            <div className="flex flex-row gap-4 items-center">
              <span className="stat-value">{item.stat.value}</span>
              <span className="stat-desc">{item.stat.subvalue}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
