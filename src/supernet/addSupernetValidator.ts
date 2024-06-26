import * as dotenv from 'dotenv'
import {
  type AddSupernetValidatorTransaction,
  Address,
  CreateSupernetTransaction,
  MCNProvider,
  MCNWallet,
  NodeId,
  SupernetId,
  type Utxo,
  buildAddSupernetValidatorTransaction,
  fetchUtxos,
  now,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const sendersAddresses: string[] = [
    masterWallet.getAddress(provider.platform.chain),
  ]
  const utxoSet: Utxo[] = await fetchUtxos(provider.platform, sendersAddresses)
  const fee: number = (await provider.info.getTxFee()).addSupernetValidatorFee
  const nodeId: string = 'NodeID-3VELiL3Hp6uFjAoFZEJpjM7PvQebidBGM'
  const startTime: bigint = now() + BigInt(30)
  const durationInDays: number = 100
  const endTime: bigint = startTime + BigInt(3600 * 24 * durationInDays + 30)
  const weight: bigint = BigInt(100)
  const supernetId: string = '2MBKX8g2K8HVfGpUfEEfAzEF27BmkcRdexiNjunJ69ScNB8tAW'
  const createSupernetTx: CreateSupernetTransaction =
    CreateSupernetTransaction.parse(
      (await provider.platform.getTx(supernetId)).tx,
    )

  // Checks, if not updated will throw error
  if (supernetId === 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP')
    throw Error('Please update the supernetId variable')

  const addSupernetValidatorTx: AddSupernetValidatorTransaction =
    buildAddSupernetValidatorTransaction(
      utxoSet,
      sendersAddresses,
      BigInt(fee),
      provider.platform.chain,
      new NodeId(nodeId),
      startTime,
      endTime,
      weight,
      new SupernetId(supernetId),
      createSupernetTx.getSupernetAuth(Address.toAddresses(sendersAddresses)),
      masterWallet.getAddress(provider.platform.chain),
      provider.mcn.id,
    )
  const txId: string = (
    await provider.platform.issueTx(
      addSupernetValidatorTx
        .signTransaction([masterWallet.getWallet(provider.platform.chain)])
        .toCHex(),
    )
  ).txID
  console.log(txId)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
