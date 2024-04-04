import * as dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config()
async function main() {	
	const provider = new ethers.JsonRpcProvider('http://143.42.200.89:9650/ext/bc/RDtLD2HKe46RT42MB9eP2FAW6epBLUwWnqc8LjVb1jQnLpMXW/rpc');
	const mnemonic = process.env.MNEMONIC;
	const blockNumber = await provider.getBlockNumber();
	const wallet = ethers.Wallet.fromPhrase(mnemonic, provider);
	const to = '0xeF838367631AD1f10005e761f72fAB7B2F8b4297';
	const tx = await wallet.sendTransaction({
  		to: to,
  		value: ethers.parseEther("21000000000")
	});	
	console.log(tx);
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
//RDtLD2HKe46RT42MB9eP2FAW6epBLUwWnqc8LjVb1jQnLpMXW
