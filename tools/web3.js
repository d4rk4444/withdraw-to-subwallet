import Web3 from 'web3';
import { info, privateToAddress } from './other.js';

export const getGasPrice = async(rpcProvider) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpcProvider));
    const gasPrice = await w3.eth.getGasPrice();
    const gasPriceInGwei = w3.utils.fromWei(gasPrice, 'Gwei');

    return gasPriceInGwei;
}

export const getETHAmount = async(rpc, walletAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const data = await w3.eth.getBalance(walletAddress);
    return data;
}

export const toWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.toWei(amount, type);
}

export const fromWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.fromWei(amount, type);
}

export const sendEVMTX = async(rpc, typeTx, gasLimit, toAddress, value, data, privateKey, maxFeeOrGasPrice, maxPriorityFee) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const fromAddress = privateToAddress(privateKey);
    let tx;
    
    if (typeTx == 0) {
        tx = {
            'from': fromAddress,
            'gas': gasLimit,
            'gasPrice': w3.utils.toWei(maxFeeOrGasPrice, 'Gwei'),
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        }
    } else if (typeTx == 2) {
        tx = {
            'from': fromAddress,
            'gas': gasLimit,
            'maxFeePerGas': w3.utils.toWei(maxFeeOrGasPrice, 'Gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei(maxPriorityFee, 'Gwei'),
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        }
    }

    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async(error, hash) => {
        if (!error) {
            const chain = (Object.keys(info)[Object.values(info).findIndex(e => e == rpc)]).slice(3);
            const explorer = info['explorer' + (Object.keys(info)[Object.values(info).findIndex(e => e == rpc)]).slice(3)];
            console.log(`${chain} TX: ${explorer + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}