import Web3 from 'web3';
import fs from 'fs';

export const info = {
    rpcEthereum: 'https://eth.llamarpc.com',
    rpcArbitrum: 'https://rpc.ankr.com/arbitrum',
    rpcOptimism: 'https://1rpc.io/op',
    rpcPolygon: 'https://polygon.llamarpc.com',
    rpcAvalanche: 'https://rpc.ankr.com/avalanche',
    rpcBSC: 'https://bsc.publicnode.com',
    explorerEthereum: 'https://etherscan.io/tx/',
    explorerArbitrum: 'https://arbiscan.io/tx/',
    explorerOptimism: 'https://optimistic.etherscan.io/tx/',
    explorerPolygon: 'https://polygonscan.com/tx/',
    explorerAvalanche: 'https://snowtrace.io/tx/',
    explorerBSC: 'https://bscscan.com/tx/',
}

export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const generateRandomAmount = (min, max, num) => {
    const amount = Number(Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min));
    return Number(parseFloat(amount).toFixed(num));
}

export const parseFile = (file) => {
    const data = fs.readFileSync(file, "utf-8");
    const array = (data.replace(/[^a-zA-Z0-9\n]/g,'')).split('\n');
    return array;
}

export const privateToAddress = (privateKey) => {
    const w3 = new Web3();
    return w3.eth.accounts.privateKeyToAccount(privateKey).address;
}