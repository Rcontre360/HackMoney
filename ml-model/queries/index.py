import requests
from pprint import pprint

UNISWAP_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
COMPOUND_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'
AAVEV2_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2'
BALANCER_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer'
USDC_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/centrehq/usdc'

def queryThegraph(query, api):
    print('QUWREY',query)
    request = requests.post(api,json={'query':query})
    if request.status_code == 200: 
        return request.json()
    else:
        return {}

# UNISWAP_ENDPOINT
def getQueryUniswap(address):
    query = """
{
    user(id:"%a"){
        id
        usdSwapped
        liquidityPositions {
          id
          liquidityTokenBalance
          pair{
            token0 {
              id
              symbol
              name
              totalSupply
              totalLiquidity
              derivedETH
              tradeVolume
            }
            token1 {
              id
              symbol
              name
              totalSupply
              totalLiquidity
              derivedETH
              tradeVolume
            }
            reserve0
            reserve1
            reserveUSD
          }
        }
  }
}
    """ % address
    return query.replace("'","")

# COMPOUND_ENDPOINT
def getQueryCompound(address):
    query = """
{
  account(id:"%a"){
    id
    countLiquidated
    countLiquidator
    hasBorrowed
    health
    totalBorrowValueInEth
    totalCollateralValueInEth
    tokens{
    	id
    	symbol
   		cTokenBalance
      totalUnderlyingRepaid
      totalUnderlyingSupplied
      totalUnderlyingRedeemed
      totalUnderlyingBorrowed
      borrowBalanceUnderlying
      accountBorrowIndex
  	}
  }
}
    """ % address
    return query.replace("'","")

# AAVEV2_ENDPOINT
def getQueryAAVEV2(address):
    query = """
    {
  user(id:"%a"){
    id
    borrowedReservesCount
    unclaimedRewards
    lifetimeRewards
    incentivesLastUpdated
    reserves{
      id
      usageAsCollateralEnabledOnUser
      scaledATokenBalance
      currentATokenBalance
      scaledVariableDebt
      currentVariableDebt
      principalStableDebt
      currentStableDebt
      currentTotalDebt
      stableBorrowRate
      oldStableBorrowRate
      liquidityRate
      stableBorrowLastUpdateTimestamp
      variableBorrowIndex
      aTokenincentivesUserIndex
      vTokenincentivesUserIndex
      liquidationCallHistory{
        id
        pool{
          id
        }
        collateralAmount
        principalAmount
        liquidator
        timestamp
      }
      pool {
        id
        active
        lendingPoolImpl
        lendingRateOracle
      }
    }
    depositHistory{
      id
    	amount
      reserve{
        id
        name
        decimals
        pool {
          id
        }
      }
      pool{
        id
      }
  	}
  }
}""" % address
    return query.replace("'","")

# BALANCER_ENDPOINT
def getQueryBalancer(address):
    query = """
{
  user(id:"%a"){
    id
    sharesOwned{
      id
      poolId {
        id
        publicSwap
        finalized
        symbol
        name
        cap
        active
        totalSwapVolume
        totalSwapFee
        liquidity
        tokens {
          id
          name
          symbol
          decimals
          address
          balance
        }
      }
      balance
    }
    swaps{
      id
      tokenIn
      tokenOut
      tokenAmountIn
      tokenAmountOut
      poolAddress{
        id
      }
      value
      timestamp
    }
  }
}
""" % address
    return query.replace("'","")

# UDC_ENDPOINT
def getQueryUSDC(address):
    query = """
{
user(id:"%a"){
  address
  balance
  transactionCount
}
}
""" % address
    return query.replace("'","")

