import Web3 from 'web3';
import { Account, Contract, ec, stark, hash, num, RpcProvider, CallData, cairo } from 'starknet';
import { log, info } from './other.js';

export const privateToStarknetAddress = async(privateKey) => {
    const argentXaccountClassHash = info.argentVersion == 1
        ? '0x33434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2'
        : '0x1a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003';
    const argentXproxyClassHash = info.argentVersion == 1
        ? "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918"
        : argentXaccountClassHash;

    const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKey);

    const AXproxyConstructorCallData = info.argentVersion == 1
        ? CallData.compile({
                implementation: argentXaccountClassHash,
                selector: hash.getSelectorFromName("initialize"),
                calldata: CallData.compile({ owner: starkKeyPubAX, guardian: 0n })
            })
        : CallData.compile({ owner: starkKeyPubAX, guardian: 0n });

    let AXcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPubAX,
        argentXproxyClassHash,
        AXproxyConstructorCallData,
        0
    );

    AXcontractAddress = stark.makeAddress(AXcontractAddress);

    return AXcontractAddress;
}

export const sendTransactionStarknet = async(rpc, payload, privateKey) => {
    const provider = new RpcProvider({ nodeUrl: rpc });

    const address = await privateToStarknetAddress(privateKey);
    const account = new Account(provider, address, privateKey, '1');

    try {
        const executeHash = await account.execute(payload);
        log('info', `Send TX: ${info.explorerStarknet + executeHash.transaction_hash}`);
        const res = await provider.waitForTransaction(executeHash.transaction_hash);
        log('log', `Fee: ${parseFloat(num.hexToDecimalString(res.actual_fee) / 10**18).toFixed(6)}ETH`, 'green');
    } catch (err) {
        log('error', `Error Starknet TX: ${err}`, 'red');
        console.log(err);
    }
}

export const estimateMsgFee = async(rpc, payload, privateKey) => {
    const provider = new RpcProvider({ nodeUrl: rpc });
    const account = new Account(provider, await privateToStarknetAddress(privateKey), privateKey, '1');

    const responseEstimateMessageFee = await account.estimateInvokeFee(payload);
    const msgFee = cairo.uint256(responseEstimateMessageFee.suggestedMaxFee).low;

    return msgFee;
}

export const getAmountTokenStark = async(rpc, walletAddress, tokenAddress, abiAddress) => {
    const provider = new RpcProvider({ nodeUrl: rpc });

    if (!abiAddress) { abiAddress = tokenAddress };
    const { abi: abi } = await provider.getClassAt(abiAddress);
    if (abi === undefined) { throw new Error("no abi.") };
    const contract = new Contract(abi, tokenAddress, provider);
    const balance = await contract.balanceOf(walletAddress);

    return cairo.uint256(balance.balance.low).low;
}

export const dataTransferETH = async(toAddress, amount) => {
    return [{
        contractAddress: info.Starknet.ETH,
        entrypoint: "transfer",
        calldata: CallData.compile({
            recipient: toAddress,
            amount: cairo.uint256(amount)
        })
    }];
}