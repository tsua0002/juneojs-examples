import { CrossOperation, ExecutableOperation, JEVMBlockchain, JVMBlockchain, MCNWallet, MCNAccount,
    OperationSummary, MCNProvider, SocotraJUNEAssetId, SocotraJUNEChain, SocotraJVMChain } from "juneojs"

async function main () {
    const provider: MCNProvider = new MCNProvider()
    const wallet: MCNWallet = MCNWallet.recover('raven whip pave toy benefit moment twin acid wasp satisfy crash april')
    const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
    // the chain which we will perform the cross from
    const juneChain: JEVMBlockchain = SocotraJUNEChain
    // the chain we will perform the cross to
    const jvmChain: JVMBlockchain = SocotraJVMChain
    // we need balances to perform the operation
    await mcnAccount.fetchAllBalances()
    const assetId: string = SocotraJUNEAssetId
    const amount: bigint = BigInt(1_000_000_000) // 1 JUNE
    const address: string = wallet.getAddress(jvmChain)
    // we instantiate a cross operation that we want to perform
    const cross: CrossOperation = new CrossOperation(juneChain, jvmChain, assetId, amount)
    // estimate the operation
    const summary: OperationSummary = await mcnAccount.estimate(cross)
    console.log(summary.fees)
    // execute the operation
    await mcnAccount.execute(summary)
    const executable: ExecutableOperation = summary.getExecutable()
    // the receipts should contain multiple transaction ids
    // that were performed to complete the cross operation
    console.log(executable.receipts)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})