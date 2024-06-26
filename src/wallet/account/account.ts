import * as dotenv from 'dotenv'
import {
  EVMAccount,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  SocotraJUNEAsset,
  SocotraJUNEChain,
  SocotraWJUNEAsset,
  type AssetValue,
  type ChainAccount,
  type JEVMBlockchain,
  UtxoAccount,
  JVMAccount,
} from 'juneojs'
const { exec } = require('node:child_process')

dotenv.config()

// Wrap the exec call in a promise
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, output) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(output.trim()); // trim() to remove any leading/trailing whitespace
        });
    });
}

// Define a function to initialize nodeid
async function initializeNodeId() {
    try {
        const output = await executeCommand('./../node_id.sh');
        return output;
    } catch (err) {
        console.error("could not execute command: ", err);
        return null; // or handle the error as needed
    }
}

async function main() {
  const provider: MCNProvider = new MCNProvider()
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  // create a MCNAccount from the provider with the chains of the default used MCN
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  // getting the account of one chain
  // note that if you are trying to retrieve the account of a chain that is not registered
  // in the creation of the MCNAccount you will get an error
  const account: ChainAccount = mcnAccount.getAccount(SocotraJUNEChain.id) //Yes Here a comment in end of line
  // we can fetch the balances
  // it can be done individually
  await account.fetchBalance(SocotraJUNEAsset.assetId)
  // or with multiple values
  await account.fetchAllBalances([
    SocotraWJUNEAsset.assetId,
    SocotraJUNEAsset.assetId,
  ])
  // the balance can be retrieved with either a provider and an asset id
  // the provider will try to gather information about the asset id from the network
  let balance: AssetValue = await account.getBalance(
    provider,
    SocotraJUNEAsset.assetId,
  )
  let nodeid = await initializeNodeId(); 
  console.log(nodeid)
    // or with a TokenAsset that already holds information about the asset (type, name, symbol, decimals)
  balance = account.getAssetBalance(SocotraJUNEAsset)
 
  console.log(account.addresses)
  // the returned balance will be an AssetValue which contains useful methods
  // this is the value that must be used to create transactions
  console.log("Balance AssetValue: " + balance.value)
  // this value is human friendly and shows all the decimals
  console.log("Readable balance in JUNE: " + balance.getReadableValue())
  // this value is rounded down up to 2 decimals
  console.log("Value rounded up to 2 decimals: " + balance.getReadableValueRounded())
  // this value is rounded down up to 6 decimals
  console.log("Balance rounded down up to 6 decimals: " + balance.getReadableValueRounded(6))

  // note that the JVM-Chain and Platform-Chain are both utxo accounts
  // and EVM chains are using nonce accounts
  const jvmAccount: UtxoAccount = new JVMAccount(provider, wallet)
  const juneChain: JEVMBlockchain = SocotraJUNEChain
  const juneAccount: EVMAccount = new EVMAccount(provider, juneChain.id, wallet)
  // in utxo accounts all the balances that are on the account on the network
  // should already be fetched because of the nature of utxos.
  // however in nonce accounts not all the balances at a given block can be
  // fetched that easily from the network. So if you want to get the balance
  // of a specific asset on such account, you should make sure that it is fetched first.
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
