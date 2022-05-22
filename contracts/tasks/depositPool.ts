import {task} from "hardhat/config";

import {attach, getReceipt} from "@utils/contracts";
import {SuperToken, MockERC20, LendingPool} from "@sctypes/index";

task("action:deposit", "deploy lending protocol")
  .addParam("pool", "pool address")
  .addParam("amount", "deposit amount")
  .setAction(async (taskArgs: Record<string, string>, hre) => {
    const {ethers, network} = hre;
    const {pool: poolAddress, amount} = taskArgs;
    const account = (await ethers.getSigners())[0];

    const pool = <LendingPool>await attach(hre, "LendingPool", poolAddress);
    const superToken = <SuperToken>await attach(hre, "SuperToken", await pool.token());
    const token = <MockERC20>await attach(hre, "MockERC20", await superToken.getUnderlyingToken());

    if ((await token.balanceOf(account.address)).lt(amount)) {
      console.log("minting...");
      await token.mint(account.address, `${amount}000000`);
    }

    console.log("approve token...");
    await token.approve(superToken.address, amount);
    console.log("upgrade token...");
    await superToken.upgrade(amount);
    console.log("approve superToken...");
    await superToken.approve(pool.address, amount);
    console.log("deposit...");
    await pool.deposit(amount, {gasLimit: 200700});

    console.log(`SUCCESS. Pool balance: ${await superToken.balanceOf(pool.address)}`);
  });
