const DAI_MAINNET_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const DAI_RINKEBY_TOKEN_ADDRESS = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";

// TODO stop exposing data object [vr 17-09-2021]
// cconnectGraphEndpoint is https://github.com/aragon/connect/tree/master/packages/connect-thegraph
export const networkConfigs = {
  mainnet: {
    isActive: true,
    addresses: {
      ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      dai: DAI_MAINNET_TOKEN_ADDRESS,
      governExecutorProxy: "0x2ac40310167fb00afa3c0bb5953c707db155afac",
    },
    nodes: {
      defaultEth: "wss://mainnet.eth.aragon.network/ws",
    },
    connectGraphEndpoint: "https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet",
    settings: {
      chainId: 1,
      live: true,
    },
  },
  ropsten: {
    isActive: false,
    addresses: {
      ensRegistry: "0x6afe2cacee211ea9179992f89dc61ff25c61e923",
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: "wss://ropsten.eth.aragon.network/ws",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 3,
    },
  },
  rinkeby: {
    isActive: true,
    apm: {
      ipfs: {
        gateway: "https://ipfs.eth.aragon.network/ipfs",
      },
    },
    addresses: {
      ensRegistry: "0x98df287b6c145399aaa709692c8d308357bc085d",
      dai: DAI_RINKEBY_TOKEN_ADDRESS,
      governExecutorProxy: "0x0451533f685fe028c439821b7502e4cf63b4c32f",
      agentImplementation: "0xe10c2dE02F1c64485B680FC561E8E9c680691FAA",
      managedPortfolioFactory: "0xeb7845d98Ac2783Eb53cCfc8c4a503B572353046",
      lenderVerifier: "0x9d3B367a3Ff089bf701cBfBB4696Cb197818e84a",
      protocolConfig: "0x797DAeF4861cC598A5996be49296206bc2a6E7Da",
      bullet: "0x25C5148b4462C71e4f6FbE227E013bB739aB8412",
      signatureVerfier: "0x56fa9306a64d41879f93D1aE77079FA96A0289B5",
      token: "0x739e97FA433c9c70055d9E3AC18D76908D9C67bd",
      loansReader: "0x2FbE8cDf373B42f23C112fF3734b5375678Bda41",
      managedPortfolioFactoryImplementation: "0x9D6c634542E2B7cf1784b7deA29a049ae324Cc44",
      portfolioTokenImplementation: "0x2ebe1950A6b902943e2A6C3d49cde88661De6Fe0",
      assetWrapper: "0x19364c71153C50fc3caffB1857454E4FB4AB55AB",
      membership: "0x21CE25D9159c23e2383549d8970EF96dE0130E68",
      company: "0xA264b54c6A9146d437206C6Da0243e37f924f58c",
      reputation: "0x15611E519f336A6e0b88059E75bfCB4a567131b4",
    },
    nodes: {
      defaultEth: "wss://rinkeby.eth.aragon.network/ws",
    },
    connectGraphEndpoint: "https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby",
    settings: {
      chainId: 4,
      live: true,
    },
  },
  // xDai is an experimental chain in the Aragon Client. It's possible
  // and expected that a few things will break.
  xdai: {
    isActive: false,
    addresses: {
      ensRegistry: "0xaafca6b0c89521752e559650206d7c925fd0e530",
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: "wss://xdai.poanetwork.dev/wss",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 100,
    },
  },
  polygon: {
    isActive: true,
    apm: {
      ipfs: {
        gateway: "https://ipfs.eth.aragon.network/ipfs",
      },
    },
    addresses: {
      ensRegistry: "0x3c70a0190d09f34519e6e218364451add21b7d4b",
      governExecutorProxy: null,
      dai: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      agentImplementation: "0xB9C575b6e15F1944FCe449471D9dfc25D15874D6",
    },
    nodes: {
      defaultEth: "wss://mainnet-polygon.aragon.network/ws",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 137,
      live: true,
      options: {
        timeout: 30000, // ms

        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - defaul: 8MiB
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },

        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    },
  },
  mumbai: {
    isActive: true,
    addresses: {
      ensRegistry: "0x431f0eed904590b176f9ff8c36a1c4ff0ee9b982",
      governExecutorProxy: null,
      dai: "0x94f417C155bB3fF7365828Bb7aCD26E84C17e830",
    },
    nodes: {
      defaultEth: "wss://matic-testnet-archive-ws.bwarelabs.com",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 80001,
      live: true,
    },
  },
  bsc_testnet: {
    isActive: true,
    addresses: {
      ensRegistry: "0x843ddfab8406e752d03fa75dbb275070f368658d",
      governExecutorProxy: null,
      dai: "0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867",
    },
    nodes: {
      defaultEth: "wss://speedy-nodes-nyc.moralis.io/e2537fd4d6ad21265cf9d450/bsc/testnet/ws",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 97,
      live: true,
    },
  },

  harmony: {
    isActive: true,
    enableMigrateBanner: false,
    addresses: {
      ensRegistry: "0x843ddfab8406e752d03fa75dbb275070f368658d",
      governExecutorProxy: null,
      dai: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    },
    nodes: {
      defaultEth: "wss://ws.s0.t.hmny.io/",
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 1666600000,
      live: false,
      events: {
        blockSizeLimit: 1024,
      },
      options: {
        timeout: 30000, // ms

        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },

        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    },
  },
};

export function getNetworkConfig(type: string): any {
  return networkConfigs[type as keyof typeof networkConfigs];
}
