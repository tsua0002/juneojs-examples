import { ethers } from 'ethers';
import { ERC20 } from '@openzeppelin/contracts/token/erc20/ERC20';

async function deployERC20() {
	const provider = new ethers.JsonRpcProvider('http://143.42.200.89:9650/ext/bc/RDtLD2HKe46RT42MB9eP2FAW6epBLUwWnqc8LjVb1jQnLpMXW/rpc');
	const wallet = new ethers.Wallet('502d23993c96aae083bbb1bff6d7117adc58d25e2f225b68ef34e44cf8cb4df7', provider);
	const erc20Factory = new ContractFactory(
    		ERC20.interface.abi,
        	ERC20.interface.encodeDeploy(
	await ethers.getContractFactory('ERC20').getDeployTransaction(
              'MyToken',
              'MTK',
              '1000000000000000000000000000'
            )
        ),
    wallet );
	const erc20Contract = await erc20Factory.deploy('YourTokenName','YTN',18, ethers.parseEther("21000000000"));
	await erc20Contract.deploymentTransaction;
	console.log('ERC20 Token Contract Address:', erc20Contract);
}

deployERC20().then(() => console.log('ERC20 Contract Deployed Successfully!')).catch(err => console.error('Error deploying ERC20 contract:', err));


