import {Web3Provider} from "@ethersproject/providers";
import {asyncScheduler} from "rxjs";
import {takeWhile, filter, first, throttleTime} from "rxjs/operators";

import {getNetworkConfig} from "@utils/network";
import {attach} from "@utils/contracts";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const Aragon = require("@aragon/wrapper").default;
const ensResolve = require("@aragon/wrapper").ensResolve;
const abi = require("web3-eth-abi");

const addressesEqual = (first: string, second: string) => {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
};

const subscribe = (
  wrapper: InstanceType<typeof Aragon>,
  {
    onApps,
    onForwarders,
    onTransaction,
    onPermissions,
  }: Partial<Record<"onApps" | "onForwarders" | "onTransaction" | "onPermissions", Function>>,
) => {
  const {apps, forwarders, transactions, permissions} = wrapper;

  const subscriptions = {
    apps: apps.subscribe(onApps),
    connectedApp: null,
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    permissions: permissions.subscribe(onPermissions),
  };

  return subscriptions;
};

export async function resolveEnsDomain(domain: string, opts: any) {
  try {
    return await ensResolve(domain, opts);
  } catch (err: any) {
    if (err.message === "ENS name not defined.") {
      return "";
    }
    throw err;
  }
}

type ExecParams = {
  app: string;
  method: string;
  wrapper: InstanceType<typeof Aragon>;
  params: unknown[];
};

export const exec = async ({app, method, params, wrapper}: ExecParams) => {
  const transactionPath = (await getTransactionPath(app, method, params, wrapper))[0];

  if (!transactionPath) throw new Error("Cannot find transaction path for executing action");

  return {
    transactionPath,
  };
};

type GetWrapperOptions = {
  provider: Web3Provider;
  accounts: string[];
  ipfsConf: Object;
  gasPrice?: string;
  onApps?: Function;
  onForwarders?: Function;
  onTransaction?: Function;
  onDaoAddress?: Function;
  onPermissions?: Function;
};

let wrapper: InstanceType<typeof Aragon>;

export async function createWrapper(hre: HardhatRuntimeEnvironment, dao: string) {
  const provider = hre.web3.currentProvider;
  const network = getNetworkConfig(hre.network.name);
  const ipfsConf = network.apm.ipfs;
  const ensRegistryAddress = network.addresses.ensRegistry;
  const accounts = (await hre.ethers.getSigners()).map(({address}) => address);
  const isDomain = (dao: string) => /[a-z0-9]+\.eth/.test(dao);

  const daoAddress = isDomain(dao)
    ? await resolveEnsDomain(dao, {
      provider,
      registryAddress: ensRegistryAddress,
    })
    : dao;

  if (!daoAddress) {
    throw new Error("The provided DAO address is invalid");
  }

  const nxtWrapper = new Aragon(daoAddress, {
    provider,
    apm: {
      ipfs: ipfsConf,
      ensRegistryAddress,
    },
  });

  try {
    await nxtWrapper.init({accounts: {providedAccounts: accounts}});
  } catch (err: any) {
    if (err.message === "connection not open") {
      throw new Error("The wrapper cannot be initialized without a connection");
    }
    throw err;
  }

  const subscriptions = subscribe(nxtWrapper, {});

  nxtWrapper.cancel = () => {
    Object.values(subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  };

  return nxtWrapper;
}

export const setWrapper = (_wrapper: InstanceType<typeof Aragon>) => {
  wrapper = _wrapper;
};

export const getWrapper = async (hre: HardhatRuntimeEnvironment, dao: string) => {
  const network = getNetworkConfig(hre.network.name);
  return wrapper ? wrapper : await createWrapper(hre, dao);
};

export async function getApps(wrapper: InstanceType<typeof Aragon>) {
  return (
    wrapper.apps
      // If the app list contains a single app, wait for more
      .pipe(takeWhile((apps: unknown[]) => apps.length <= 1, true))
      .toPromise()
  );
}

export async function getTransactionPath(
  appAddress: string,
  method: string,
  params: unknown[],
  wrapper: InstanceType<typeof Aragon>,
) {
  // Wait for app info to load
  const apps: any[] = await wrapper.apps
    .pipe(
      // If the app list contains a single app, wait for more
      filter((apps: unknown[]) => apps.length > 1),
      throttleTime(3000, asyncScheduler, {trailing: true}),
      first(),
    )
    .toPromise();
  console.log("APPS", {apps});

  if (!apps.some(app => addressesEqual(appAddress, app.proxyAddress))) {
    throw new Error(`Can't find app ${appAddress}.`);
  }

  // If app is the ACL, call getACLTransactionPath
  return appAddress === wrapper.aclProxy.address
    ? wrapper.getACLTransactionPath(method, params)
    : wrapper.getTransactionPath(appAddress, method, params);
}

export const encodeActCall = (signature: string, params: unknown[]) => {
  const sigBytes = abi.encodeFunctionSignature(signature);

  const types = signature.replace(")", "").split("(")[1];

  // No params, return signature directly
  if (types === "") {
    return sigBytes;
  }

  const paramBytes = abi.encodeParameters(types.split(","), params);

  return `${sigBytes}${paramBytes.slice(2)}`;
};

export const installAgent = async (
  hre: HardhatRuntimeEnvironment,
  {dao, network}: {dao: string; network: string},
) => {
  const wrapper = await getWrapper(hre, dao);
  const net = getNetworkConfig(network);
  const appId = "0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a";
  const initializeSignature = "0x8129fc1c"; // abi.encodeWithSignature('initialize()',[]);
  console.log(initializeSignature);

  const {transactionPath} = await exec({
    app: dao,
    method: "newAppInstance(bytes32,address,bytes,bool)",
    params: [appId, net.addresses?.agentImplementation, initializeSignature, false],
    wrapper,
  } as any);

  return transactionPath;
};

export const isEnsDomain = async (args: {network: string; daoname: string}) => {
  const network = getNetworkConfig(args.network);
  const registryAddress = network.addresses.ensRegistry;

  //try {
  //return (
  //(await resolveEnsDomain(args.daoname, {
  //provider: getWeb3(network.nodes.defaultEth).currentProvider,
  //registryAddress: registryAddress,
  //})) || false
  //);
  //} catch (err) {
  //return false;
  //}
};

export const createMiniDaoAragon = async (
  hre: HardhatRuntimeEnvironment,
  args: {
    dao: string;
    minidao: string;
    members: string[];
    stakes: string[];
    type: "membership" | "reputation" | "company";
    quorum: string;
    support: string;
    duration: number;
  },
) => {
  const network = getNetworkConfig(hre.network.name);
  const web3 = hre.web3;
  const tokenName = `${args.minidao} Token`;
  const tokenSymbol = "TTT";
  const daoWrapper = await getWrapper(hre, args.dao);
  const agent: string = (await getApps(daoWrapper)).find(
    ({appName}: {appName: string}) => appName === "agent.aragonpm.eth",
  )?.proxyAddress;

  const membershipCall = encodeActCall(
    "newTokenAndInstance(string,string,string,address[],uint64[3],uint64,bool,address)",
    [
      tokenName,
      tokenSymbol,
      args.minidao.split(".")[0],
      args.members,
      [args.support, args.quorum, args.duration],
      0,
      true,
      agent,
    ],
  );

  const companyOrReputationCall = encodeActCall(
    "newTokenAndInstance(string,string,string,address[],uint256[],uint64[3],uint64,bool,address)",
    [
      tokenName,
      tokenSymbol,
      args.minidao.split(".")[0],
      args.members,
      args.stakes,
      [args.support, args.quorum, args.duration],
      0,
      true,
      agent,
    ],
  );

  const callData = args.type === "membership" ? membershipCall : companyOrReputationCall;
  const address =
    args.type === "membership"
      ? network.addresses.membership
      : args.type === "company"
        ? network.addresses.company
        : network.addresses.reputation;

  const {transactionPath} = await exec({
    app: agent,
    method: "execute",
    params: [address, 0, callData],
    wrapper: daoWrapper,
  } as any);

  await web3.eth.sendTransaction(transactionPath);
};

export const addMiniDaoMember = async (
  hre: HardhatRuntimeEnvironment,
  args: {
    network: string;
    agent: string;
    newMember: string;
    miniDaoTokenManager: string;
  },
) => {
  const web3 = hre.web3;

  const callData = encodeActCall("mint(address,uint256)", [args.newMember, 1]);
  console.log("addMiniDaoMember", args);

  const {transactionPath} = await exec({
    app: args.agent,
    method: "execute",
    params: [args.miniDaoTokenManager, 0, callData],
    wrapper,
  } as any);

  await web3.eth.sendTransaction(transactionPath);
};
