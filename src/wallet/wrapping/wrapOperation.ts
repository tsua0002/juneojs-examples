import { ExecutableOperation, JEVMBlockchain, MCNWallet, MCNAccount, NetworkOperationStatus,
    OperationSummary, MCNProvider, SocotraJUNEChain, SocotraWJUNEAsset, WrapOperation } from "juneojs"

async function main () {
    const provider: MCNProvider = new MCNProvider()
    const wallet: MCNWallet = MCNWallet.recover('raven whip pave toy benefit moment twin acid wasp satisfy crash april')
    const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
    // the chain which we will perform an action on
    const juneChain: JEVMBlockchain = SocotraJUNEChain
    // we instantiate a wrap operation that we want to perform on the chain
    const wrapOperation: WrapOperation = new WrapOperation(juneChain, SocotraWJUNEAsset, BigInt("1000000000000000000"))
    // estimate the operation to get a summary
    const summary: OperationSummary = await mcnAccount.estimate(wrapOperation)
    // from the summary we can get the executable operation that will be used to perform it
    const executable: ExecutableOperation = summary.getExecutable()
    // execute the operation
    await mcnAccount.execute(summary)
    // check if the operation is successfull
    console.log(executable.status === NetworkOperationStatus.Done)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})