import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import makeBlockie from "ethereum-blockies-base64";
import { MENU_ITEMS } from "../../../constants";
import React from "react";

import getWeb3 from "../../getWeb3";

const Navbar = () => {
  const [account, setAccount] = React.useState(null);
  const [blockie, setBlockie] = React.useState(null);
  const [wallet, setWallet] = React.useState({ status: null });

  const connectWallet = async () => {
    const wall = await getWeb3();
    const acc = await wall.eth.getAccounts();
    const img = makeBlockie(acc[0]);
    setBlockie(img);
    setAccount(acc[0]);
    setWallet({ status: "connected" });
  };

  React.useEffect(() => {
    // Initiates the connection to an organization

    async function fetchData() {
      // You can await here
      // const org = await connect('quicklend.aragonid.eth', 'thegraph', { network: 4 })
      // console.log(org)
      // ...
    }
    connectWallet();
  }, [wallet.status]);

  return (
    <div className="navbar bg-color2 shadow-md text-neutral-content px-10 sticky top-0 z-50">
      <div className="flex flex-row gap-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer text-color1 gap-4">
            <img src={"/icons/logo.png"} className="h-8 w-8" alt="" />
            ChainScore
          </div>
        </Link>
        <ul className="menu menu-horizontal p-0">
          {MENU_ITEMS.map((k, i) => (
            <li key={i} className="text-white hover:text-color1 hover:bg-color2 rounded">
              <Link href={k.url}>{k.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex ml-auto justify-end">
        <ul className="menu menu-horizontal p-0">
          <li>
            {wallet.status === "connected" ? (
              <div className="flex flex-row bg-white rounded-lg w-auto p-2">
                <img
                  src={blockie}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <p className="text-black text-sm overflow-hidden text-ellipsis w-36">{account}</p>
                  <p className="text-color1 text-sm w-auto">Connected to Rinkeby</p>
                </div>
              </div>
            ) : (
              <Button className="gradient" sx={{ my: 2 }} onClick={connectWallet}>
                <span>Connect Wallet</span>
              </Button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
