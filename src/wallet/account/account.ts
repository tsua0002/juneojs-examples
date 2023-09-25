import { AssetValue, ChainAccount, EVMAccount, JEVMBlockchain, MCNWallet, MCNAccount,
    MCNProvider, SocotraJUNEAsset, SocotraJUNEChain, SocotraWJUNEAsset } from 'juneojs'

async function main () {
    const provider: MCNProvider = new MCNProvider()
    const wallet: MCNWallet = MCNWallet.recover('raven whip pave toy benefit moment twin acid wasp satisfy crash april')
    // create a MCNAccount from the provider with the chains of the default used MCN
    const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
    // getting the account of one chain
    // note that if you are trying to retrieve the account of a chain that is not registered
    // in the creation of the MCNAccount you will get an error
    const account: ChainAccount = mcnAccount.getAccount(SocotraJUNEChain.id)
    // we can fetch the balances
    await account.fetchAllBalances()
    // the returned balance will be an AssetValue which contains useful methods
    const balance: AssetValue = account.getBalance(SocotraJUNEAsset)
    // this is the value that must be used to create transactions
    console.log(balance.value)
    // this value is human friendly and shows all the decimals
    console.log(balance.getReadableValue())
    // this value is rounded down up to 2 decimals
    console.log(balance.getReadableValueRounded())
    // this value is rounded down up to 6 decimals
    console.log(balance.getReadableValueRounded(6))

    // note that the JVM-Chain and Platform-Chain are both utxo accounts
    // and EVM chains are using nonce accounts
    const juneChain: JEVMBlockchain = SocotraJUNEChain
    const juneAccount: EVMAccount = new EVMAccount(provider, juneChain.id, wallet)
    // in utxo accounts you do not need to register assets but for nonce accounts
    // if you want to keep track of the balance of an ERC20 for example you need
    // to register them manually before fetching the balances using registerAssets
    // here for example we register the wrapped june to be tracked by this account
    juneAccount.registerAssets([SocotraWJUNEAsset])
    // it is also possible to register it using an asset id
    juneAccount.registerAssets(['0x333e51E9908dcF4Ae79250757ecC3faa21f24554'])
    // make sure that you are registering an asset from the correct chain
    // it is not necessary to register the gas token of the chain
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})