import Web3 from 'web3';
import fs from 'fs';
import consoleStamp from 'console-stamp';
import chalk from 'chalk';

export const log = (type, msg, color) => {
    const output = fs.createWriteStream(`history.log`, { flags: 'a' });
    const logger = new console.Console(output);
    consoleStamp(console, { format: ':date(HH:MM:ss) :label' });
    consoleStamp(logger, { format: ':date(yyyy/mm/dd HH:MM:ss) :label', stdout: output });

    if (!color) {
        console[type](msg);
    } else {
        console[type](chalk[color](msg));
    }
    logger[type](msg);
}

export const info = {
    rpcEthereum: 'https://eth.llamarpc.com',
    rpcArbitrum: 'https://rpc.ankr.com/arbitrum',
    rpcOptimism: 'https://1rpc.io/op',
    rpcPolygon: 'https://polygon.llamarpc.com',
    rpcAvalanche: 'https://rpc.ankr.com/avalanche',
    rpcBSC: 'https://bsc.publicnode.com',
    rpcFantom: 'https://1rpc.io/ftm',
    rpcCore: 'https://rpc.coredao.org',
    rpcHarmony: 'https://rpc.ankr.com/harmony',
    rpczkSync: 'https://zksync.drpc.org',
    rpcLinea: 'https://linea.drpc.org',
    explorerEthereum: 'https://etherscan.io/tx/',
    explorerArbitrum: 'https://arbiscan.io/tx/',
    explorerOptimism: 'https://optimistic.etherscan.io/tx/',
    explorerPolygon: 'https://polygonscan.com/tx/',
    explorerAvalanche: 'https://snowtrace.io/tx/',
    explorerBSC: 'https://bscscan.com/tx/',
    explorerFantom: 'https://ftmscan.com/tx/',
    explorerCore: 'https://scan.coredao.org/tx/',
    explorerHarmony: 'https://explorer.harmony.one/tx/',
    explorerzkSync: 'https://explorer.zksync.io/tx/',
    explorerLinea: 'https://lineascan.build/tx/',
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