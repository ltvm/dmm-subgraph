import { BigDecimal } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const ADDRESS_LOCK = '0xffffffffffffffffffffffffffffffffffffffff'

export const FACTORY_ADDRESS = '0xd9bfe9979e9ca4b2fe84ba5d4cf963bbcb376974'

export const ETH_PRICING_POOLS = '0xef07828031970c6bb67d52624396e416aef7a95c'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('1000')

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('100') // default is 2

export const WRAPPED_NATIVE_ADDRESS = '0x8d193c6efa90bcff940a98785d1ce9d093d3dc8a'
export const DAI_ADDRESS = '0xe7dc549ae8db61bde71f22097becc8db542ca100'
export const USDC_ADDRESS = '0xca424b845497f7204d9301bd13ff87c0e2e86fcf'
export const USDT_ADDRESS = '0x9b5f27f6ea9bbd753ce3793a07cba3c74644330d'
export const WETH_ADDRESS = ''

export const KNC_ADDRESS = ''
export const KNC_NAME = 'Kyber Network'
export const KNC_SYMBOL = 'KNC'

export const KNCL_ADDRESS = ''
export const KNCL_NAME = 'Kyber Network Legacy'
export const KNCL_SYMBOL = 'KNCL'

export let FACTORY_BPS = BigDecimal.fromString('10000')

export let NETWORK = 'bttc'
