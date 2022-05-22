import React from "react";
import {StadisticsBoard} from "./StadisticsBoard/StadisticsBoard";
import Table, {PoolRow} from "./table/table";

import {attach} from "@shared/utils/contracts";
import {getNetworkConfig} from "@shared/utils/network";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const AppComponent: React.FunctionComponent<{}> = (props) => {
  const [rows, setRows] = React.useState<PoolRow[]>([]);

  const getLendingPools = async () => {
    const {addresses} = getNetworkConfig("mumbai"); //TODO hardcoded mumbai
    const factory = attach("ProtocolFactory", addresses.factory, process.env.MUMBAI_PROVIDER);
    const lastId = (await factory.portfolioId()).toNumber();
    const rawPools = await Promise.all(
      new Array(lastId).fill(0).map((a, i) => factory.getPortfolio(i))
    );
    const pools: PoolRow[] = [];

    for (let i of rawPools) {
      const pool = attach("LendingPool", i.pool, process.env.NEXT_PUBLIC_MUMBAI_PROVIDER); //TODO hardcoded mumbai
      const token = attach("ERC20", await pool.token(), process.env.NEXT_PUBLIC_MUMBAI_PROVIDER); //TODO hardcoded mumbai
      const loanManager = attach(
        "LoanManager",
        await pool.loanManager(),
        process.env.NEXT_PUBLIC_MUMBAI_PROVIDER
      );

      pools.push({
        token: token.address,
        tokens_symbol: await token.symbol(),
        tokens_saved: (await token.balanceOf(pool.address)).toString(),
        token_usd: randomIntFromInterval(1, 200),
        loan_created: (await loanManager.loanId()).toString(),
        dao: i.manager,
        loan_manager: loanManager.address,
        pool: {
          value: pool.address,
          id: 1,
        },
      });
    }

    setRows(pools);
  };

  React.useEffect(() => {
    getLendingPools();
  }, []);

  return (
    <div className="flex flex-col items-center bg-color2">
      <StadisticsBoard></StadisticsBoard>
      <div className="w-full text-center">
        <Table rows={rows} />
      </div>
    </div>
  );
};

export default AppComponent;
