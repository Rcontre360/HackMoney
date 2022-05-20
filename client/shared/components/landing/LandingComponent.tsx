import React from "react";
import { StatisticsBoard } from "./StatisticsBoard";
import LendingTable from "./LendingTable";

const LandingComponent: React.FunctionComponent<{}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <StatisticsBoard></StatisticsBoard>
      <div className="w-full text-center mb-10">
        <LendingTable />
      </div>
    </div>
  );
};

export default LandingComponent;
