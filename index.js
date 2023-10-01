import { info,
    timeout,
    parseFile,
    generateRandomAmount,
    privateToAddress, 
    log} from './tools/other.js';
import { fromWei, getETHAmount,
    getEstimateGas,
    getGasPrice,
    getPriorityGasPrice,
    numberToHex,
    sendEVMTX, 
    toWei} from './tools/web3.js';
import { dataTransferETH, estimateMsgFee, getAmountTokenStark, privateToStarknetAddress, sendTransactionStarknet } from './tools/starknet.js';
import { subtract, multiply, add } from 'mathjs';
import fs from 'fs';
import readline from 'readline-sync';
import consoleStamp from 'console-stamp';
import chalk from 'chalk';

const output = fs.createWriteStream(`history.log`, { flags: 'a' });
const logger = new console.Console(output);
consoleStamp(console, { format: ':date(HH:MM:ss)' });
consoleStamp(logger, { format: ':date(yyyy/mm/dd HH:MM:ss)', stdout: output });

const pauseWalletTime = generateRandomAmount(process.env.TIMEOUT_WALLET_SEC_MIN * 1000, process.env.TIMEOUT_WALLET_SEC_MAX * 1000, 0);
const random = info.random;

const withdrawToChain = async(chain, toAddress, privateKey) => {
    const address = privateToAddress(privateKey);

    const rpc = info['rpc' + chain];
    const eip1559 = ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon']
    const typeTX = eip1559.includes(chain) ? 2 : 0;

    try {
        await getETHAmount(rpc, address).then(async(amountETH) => {
            await getGasPrice(rpc).then(async(gasPrice) => {
                gasPrice = (parseFloat(gasPrice).toFixed(9)).toString();
                const priorityMaxFee = typeTX == 2 ? await getPriorityGasPrice(rpc) : 0;
                const gasLimit = chain == 'Arbitrum' || chain == 'zkSync'
                    ? await getEstimateGas(rpc, '0x', toWei('0.1', 'ether'), address, toAddress)
                    : 21000;
                if (chain == 'Optimism') {
                    let gasPriceOP = parseFloat(await getGasPrice(rpc)).toFixed(9).toString();
                    let gasPriceETH = parseFloat(await getGasPrice(info.rpcEthereum)).toFixed(6).toString();
                    amountETH = parseInt(multiply(subtract(amountETH, add(multiply(toWei(gasPriceOP, 'gwei') + priorityMaxFee, 21000), multiply(toWei(gasPriceETH, 'gwei'), 1400))), random));
                } else {
                    amountETH = typeTX == 0
                        ? parseInt(multiply(subtract(amountETH, gasLimit * toWei(gasPrice, 'gwei')), random))
                        : parseInt(multiply(subtract(amountETH, gasLimit * toWei(gasPrice + priorityMaxFee, 'gwei')), random));
                }

                await sendEVMTX(rpc, typeTX, gasLimit, toAddress, amountETH, null, privateKey, gasPrice, gasPrice);

                log('info', `${chain}. Transfer ${parseFloat(fromWei(numberToHex(amountETH), 'ether')).toFixed(5)} to ${toAddress}`, 'yellow');
            });
        });
    } catch (err) {
        log('log', err);
        return;
    }
}

const withdrawToStarknet = async(toAddress, privateKey) => {
    const rpc = info.rpcStarknet;
    const address = await privateToStarknetAddress(privateKey);

    try {
        await getAmountTokenStark(rpc, address, info.Starknet.ETH, info.Starknet.ETHAbi).then(async(amountETH) => {
            await dataTransferETH(toAddress, amountETH).then(async(res) => {
                await estimateMsgFee(rpc, res, privateKey).then(async(estimateFee) => {
                    amountETH = parseInt(multiply(subtract(amountETH, estimateFee), random));

                    await dataTransferETH(toAddress, amountETH).then(async(res) => {
                        await sendTransactionStarknet(rpc, res, privateKey);
                    });
                    log('info', `Starknet. Transfer ${parseFloat(fromWei(numberToHex(amountETH), 'ether')).toFixed(5)} to ${toAddress}`, 'yellow');
                });
            });
        });
    } catch (err) {
        log('log', err);
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
        'Withdraw ZKSYNC',
        'Withdraw STARKNET',
    ];

    const index = readline.keyInSelect(allStage, 'Choose stage!');
    if (index == -1) { process.exit() };
    console.log(chalk.green(`Start ${allStage[index]}`));
    logger.log(`Start ${allStage[index]}`);
    
    for (let i = 0; i < wallet.length; i++) {
        try {
            if (i != 10) {
                log('info', `Wallet ${i+1}: ${privateToAddress(wallet[i])} | Subwallet CEX ${i+1}: ${walletCEX[i]}`, 'blue');
            } else {
                log('info', `Wallet ${i+1}: ${await privateToStarknetAddress(wallet[i])} | Subwallet CEX ${i+1}: ${walletCEX[i]}`, 'blue');
            }
            
            if (!walletCEX[i]) { throw new Error('Add Wallets in SubWallets in file!'); }
        } catch (err) { console.log(err) } //throw new Error('Add Private keys in file!'); }

        if (index == 0) {
            await withdrawToChain('Ethereum', walletCEX[i], wallet[i]);
        } else if (index == 1) {
            await withdrawToChain('Arbitrum', walletCEX[i], wallet[i]);
        } else if (index == 2) {
            await withdrawToChain('Optimism', walletCEX[i], wallet[i]);
        } else if (index == 3) {
            await withdrawToChain('Avalanche', walletCEX[i], wallet[i]);
        } else if (index == 4) {
            await withdrawToChain('Polygon', walletCEX[i], wallet[i]);
        } else if (index == 5) {
            await withdrawToChain('BSC', walletCEX[i], wallet[i]);
        } else if (index == 6) {
            await withdrawToChain('Fantom', walletCEX[i], wallet[i]);
        } else if (index == 7) {
            await withdrawToChain('Core', walletCEX[i], wallet[i]);
        } else if (index == 8) {
            await withdrawToChain('Harmony', walletCEX[i], wallet[i]);
        } else if (index == 9) {
            await withdrawToChain('zkSync', walletCEX[i], wallet[i]);
        } else if (index == 10) {
            await withdrawToStarknet(walletCEX[i], wallet[i]);
        }

        await timeout(pauseWalletTime);
    }
    console.log(chalk.bgMagentaBright('Process End!'));
    logger.log('Process End!');
})();