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
      host: "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",
      cfa: "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A",
      superTokenFactory: "0xd465e36e607d493cd4CC1e83bea275712BECd5E0",
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
      host: "0xEB796bdb90fFA0f28255275e16936D25d3418603",
      cfa: "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873",
      superTokenFactory: "0x200657E2f123761662567A1744f9ACAe50dF47E6",
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
