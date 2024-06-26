import * as dotenv from 'dotenv'
import {
  MCNProvider,
  MCNWallet,
  StakeManager,
  type Utxo,
  type UtxoFeeData,
  fetchUtxos,
  now,
} from 'juneojs'
import { initializeNodeId } from './nodeId';

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  // stake manager to handle staking
  let manager: StakeManager = StakeManager.from(provider, wallet)
  // instantiation using vm wallet
  manager = new StakeManager(
    provider,
    wallet.getWallet(provider.platform.chain),
  )
  // the node id where to delegate funds
  let nodeid = await initializeNodeId()
  const nodeId: string = nodeid
  // the amount to delegate
  const stakeAmount: bigint = BigInt(10000000000)
  // the time to start delegation (must be > now)
  const startTime: bigint = now() + BigInt(30)
  // the time to end the delegation with start time is staking period
  // staking period has a minimal and maximal value
  const endTime: bigint = now() + BigInt(86400 * 15)
  // getting an estimation for the expected reward of a validation
  const validationReward: bigint = StakeManager.estimateValidationReward(
    endTime - startTime,
    stakeAmount,
  )
  // the expected reward of a delegation returns the amount perceived by the delegator
  // which is the same reward as the validation but with the delegation fee of the validator deducted
  const delegationReward: bigint = StakeManager.estimateDelegationReward(
    endTime - startTime,
    stakeAmount,
  )
  // estimating the fee
  const fee: UtxoFeeData = await manager.estimateDelegationFee(
    nodeId,
    stakeAmount,
    startTime,
    endTime,
  )
  // we can display those fee and optionnaly use them to execute the staking
  // it returns the id of the transaction that was created
  // try to delegate with currently available utxos in the relay chain
  const transasctionId: string = await manager.delegate(
    nodeId,
    stakeAmount,
    startTime,
    endTime,
    fee,
  )
  // if you want to validate instead of delegate use manager.validate
  // here the fee is not estimated before and used to call the unwrap function
  // so it will estimate it internally
  await manager.validate(nodeId, stakeAmount, startTime, endTime)
  // for even more advanced usage you can optionally provide the utxo set that will be used
  // to build the transaction and are thus available to consumption
  // here we fetch all utxos of the address of the wallet used to instantiate the stake manager
  // so it will be able to sign each consumed utxo properly
  const utxos: Utxo[] = await fetchUtxos(provider.platform, [
    wallet.getAddress(provider.platform.chain),
  ])
  const validateFee: UtxoFeeData = await manager.estimateValidationFee(
    nodeId,
    stakeAmount,
    startTime,
    endTime,
    utxos,
  )
  await manager.validate(
    nodeId,
    stakeAmount,
    startTime,
    endTime,
    validateFee,
    utxos,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
