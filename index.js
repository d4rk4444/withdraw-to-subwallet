import { info,
    timeout,
    parseFile,
    generateRandomAmount,
    privateToAddress } from './tools/other.js';
import { fromWei, getETHAmount,
    getGasPrice,
    sendEVMTX, 
    toWei} from './tools/web3.js';
import { subtract, multiply, divide, add } from 'mathjs';
import fs from 'fs';
import readline from 'readline-sync';
import consoleStamp from 'console-stamp';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
dotenv.config();

const output = fs.createWriteStream(`history.log`, { flags: 'a' });
const logger = new console.Console(output);
consoleStamp(console, { format: ':date(HH:MM:ss)' });
consoleStamp(logger, { format: ':date(yyyy/mm/dd HH:MM:ss)', stdout: output });

const pauseWalletTime = generateRandomAmount(process.env.TIMEOUT_WALLET_SEC_MIN * 1000, process.env.TIMEOUT_WALLET_SEC_MAX * 1000, 0);
const random = generateRandomAmount(process.env.PERCENT_TRANSFER_MIN / 100, process.env.PERCENT_TRANSFER_MAX / 100, 3);

const withdrawToEthereum = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcEthereum, address).then(async(amountETH) => {
            await getGasPrice(info.rpcEthereum).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21010 * multiply(add(gasPrice, '1.5'), 10**9)), random));
                await sendEVMTX(info.rpcEthereum, 2, 21000, toAddress, amountETH, null, privateKey, gasPrice, '1.5');
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Ethereum`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} Ethereum`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToArbitrum = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcArbitrum, address).then(async(amountETH) => {
            await getGasPrice(info.rpcArbitrum).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 4000000 * multiply(gasPrice, 10**9)), random));
                await sendEVMTX(info.rpcArbitrum, 2, generateRandomAmount(3200000, 4000000, 0), toAddress, amountETH, null, privateKey, gasPrice, gasPrice);
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Arbitrum`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} Arbitrum`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToOptimism = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcOptimism, address).then(async(amountETH) => {
            await getGasPrice(info.rpcOptimism).then(async(gasPriceOP) => {
                await getGasPrice(info.rpcEthereum).then(async(gasPriceETH) => {
                    gasPriceOP = (parseFloat(multiply(gasPriceOP, 1.2)).toFixed(5)).toString();
                    gasPriceETH = (parseFloat(multiply(gasPriceOP, 1.5)).toFixed(5)).toString();
                    amountETH = parseInt(multiply(subtract(amountETH, add(multiply(toWei(gasPriceOP, 'gwei'), 21000), multiply(toWei(gasPriceETH, 'gwei'), 1400))), random));
                    await sendEVMTX(info.rpcOptimism, 0, 21000, toAddress, amountETH, null, privateKey, gasPriceOP);
                    console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Optimism`));
                    logger.log(`Send ${amountETH / 10**18} to ${toAddress} Optimism`);
                });
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToAvalanche = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcAvalanche, address).then(async(amountETH) => {
            await getGasPrice(info.rpcAvalanche).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21010 * multiply(gasPrice, 10**9)), random));
                await sendEVMTX(info.rpcAvalanche, 0, 21000, toAddress, amountETH, null, privateKey, gasPrice);
                
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Avalanche`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} Avalanche`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToPolygon = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcPolygon, address).then(async(amountETH) => {
            await getGasPrice(info.rpcPolygon).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21010 * multiply(gasPrice + 50, 10**9)), random));
                await sendEVMTX(info.rpcPolygon, 2, 21000, toAddress, amountETH, null, privateKey, gasPrice, '50');
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Polygon`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} Polygon`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToBSC = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcBSC, address).then(async(amountETH) => {
            await getGasPrice(info.rpcBSC).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21010 * multiply(gasPrice, 10**9)), random));
                await sendEVMTX(info.rpcBSC, 0, 21000, toAddress, amountETH, null, privateKey, gasPrice);
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} BSC`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} BSC`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToFantom = async(toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    try {
        await getETHAmount(info.rpcFantom, address).then(async(amountETH) => {
            await getGasPrice(info.rpcFantom).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(5)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21010 * multiply(gasPrice, 10**9)), random));
                await sendEVMTX(info.rpcFantom, 0, 21000, toAddress, amountETH, null, privateKey, gasPrice);
                console.log(chalk.yellow(`Send ${amountETH / 10**18} to ${toAddress} Fantom`));
                logger.log(`Send ${amountETH / 10**18} to ${toAddress} Fantom`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

const withdrawToChainBase = async(chain, toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    const rpc = info['rpc' + chain];
    const typeTX = chain == 'Polygon' || chain == 'Ethereum' ? 2 : 0;

    try {
        await getETHAmount(rpc, address).then(async(amountETH) => {
            await getGasPrice(rpc).then(async(gasPrice) => {
                gasPrice = (parseFloat(multiply(gasPrice, 1.2)).toFixed(6)).toString();
                amountETH = parseInt(multiply(subtract(amountETH, 21001 * multiply(gasPrice, 10**9)), random));
                await sendEVMTX(rpc, typeTX, 21000, toAddress, amountETH, null, privateKey, gasPrice, gasPrice);
                console.log(chalk.yellow(`${chain}. Transfer ${(amountETH/10**18).toFixed(5)} to ${toAddress}`));
                logger.log(`${chain}. Transfer ${(amountETH/10**18).toFixed(5)} to ${toAddress}`);
            });
        });
    } catch (err) {
        logger.log(err);
        console.log(err.message);
        return;
    }
}

(async() => {
    const wallet = parseFile('private.txt');
    const walletCEX = parseFile('subWallet.txt');
    const allStage = [
        'Withdraw ETHEREUM',
        'Withdraw ARBITRUM',
        'Withdraw OPTIMISM',
        'Withdraw AVALANCHE',
        'Withdraw POLYGON',
        'Withdraw BSC',
        'Withdraw FANTOM',
        'Withdraw CORE',
        'Withdraw HARMONY',
    ];

    const index = readline.keyInSelect(allStage, 'Choose stage!');
    if (index == -1) { process.exit() };
    console.log(chalk.green(`Start ${allStage[index]}`));
    logger.log(`Start ${allStage[index]}`);
    
    for (let i = 0; i < wallet.length; i++) {
        try {
            console.log(chalk.blue(`Wallet ${i+1}: ${privateToAddress(wallet[i])} | SubWallet CEX ${i+1}: ${walletCEX[i]}`));
            logger.log(`Wallet ${i+1}: ${privateToAddress(wallet[i])} | Subwallet CEX ${i+1}: ${walletCEX[i]}`);
            if (!walletCEX[i]) { throw new Error('Add Wallets in SubWallets in file!'); }
        } catch (err) { throw new Error('Add Private keys in file!'); }

        if (index == 0) {
            await withdrawToEthereum(walletCEX[i], wallet[i]);
        } else if (index == 1) {
            await withdrawToArbitrum(walletCEX[i], wallet[i]);
        } else if (index == 2) {
            await withdrawToOptimism(walletCEX[i], wallet[i]);
        } else if (index == 3) {
            await withdrawToAvalanche(walletCEX[i], wallet[i]);
        } else if (index == 4) {
            await withdrawToPolygon(walletCEX[i], wallet[i]);
        } else if (index == 5) {
            await withdrawToBSC(walletCEX[i], wallet[i]);
        } else if (index == 6) {
            await withdrawToFantom(walletCEX[i], wallet[i]);
        } else if (index == 7) {
            await withdrawToChainBase('Core', walletCEX[i], wallet[i]);
        } else if (index == 8) {
            await withdrawToChainBase('Harmony', walletCEX[i], wallet[i]);
        }

        await timeout(pauseWalletTime);
    }
    console.log(chalk.bgMagentaBright('Process End!'));
    logger.log('Process End!');
})();