import { log, BigInt, Bytes, Address } from '@graphprotocol/graph-ts'
import { KyberFairLaunch, Transaction, Vest as VestEvent } from '../types/schema'
import { KyberFairLaunch as KyberFairLaunchTemplate } from '../types/templates'

import { RewardContractAdded, Vested } from '../types/KyberRewardLocker/KyberRewardLocker'

import { KyberFairLaunch as KyberFairLaunchContract } from '../types/templates/KyberFairLaunch/KyberFairLaunch'
import { createOrLoadTransaction, ZERO_BI } from './utils'

export function createOrLoadFairLaunch(id: string): KyberFairLaunch {
  let fairLaunch = KyberFairLaunch.load(id);
  if (fairLaunch == null) {
    fairLaunch = new KyberFairLaunch(id);
  }

  return fairLaunch as KyberFairLaunch;
}

export function updateFairLaunchRewardTokens(id: string, address: Address): Bytes[] {
  let fairLaunchContract = KyberFairLaunchContract.bind(address)
  let result = fairLaunchContract.try_getRewardTokens()
  if (result.reverted) {
    log.warning('failed to get reward tokens from rewardContract={}', [id])
    return []
  }

  return result.value as Bytes[]
}

export function updateFairLaunchStakeTokens(id: string, address: Address): Bytes[] {
  let fairLaunchContract = KyberFairLaunchContract.bind(address)
  let poolLength = fairLaunchContract.poolLength()
  let stakeTokens: Bytes[] = []
  if (poolLength.notEqual(ZERO_BI) && poolLength.lt(BigInt.fromI32(stakeTokens.length))) {
    for (let i: i32 = 0; i < fairLaunchContract.poolLength().toI32(); i++) {
      let addedPoolInfo = false, tryTime = 0
      while (!addedPoolInfo && tryTime < 14) {
        let poolInfo = fairLaunchContract.try_getPoolInfo(BigInt.fromI32(i));
        if (!poolInfo.reverted) {
          stakeTokens.push(poolInfo.value.value1)
          addedPoolInfo = true
        }
        tryTime += 1
      }
    }
  }

  return stakeTokens as Bytes[]
}

export function handleRewardContractAdded(event: RewardContractAdded): void {
  let fairLaunchId = event.params.rewardContract.toHex()
  let fairLaunch = createOrLoadFairLaunch(fairLaunchId)
  if (fairLaunch !== null) {
    return
  }
  KyberFairLaunchTemplate.create(event.params.rewardContract)
  //init reward contract
  fairLaunch.stakeTokens = updateFairLaunchRewardTokens(fairLaunchId, event.params.rewardContract)
  fairLaunch.stakeTokens = updateFairLaunchStakeTokens(fairLaunchId, event.params.rewardContract)
  fairLaunch.save()
}

export function handleVestd(event: Vested): void {
  let transaction = createOrLoadTransaction(event.transaction.hash, event.block)

  let vests = transaction.vests
  let vest = new VestEvent(
    event.transaction.hash
      .toHexString()
      .concat('-')
      .concat(BigInt.fromI32(vests.length).toString())
  )

  vest.transaction = transaction.id
  vest.timestamp = event.block.timestamp
  vest.user = event.params.beneficiary
  vest.amount = event.params.vestedQuantity
  vest.rewardToken = event.params.token
  vest.save()

  transaction.vests = vests.concat([vest.id])
  transaction.save()
}
