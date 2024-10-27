import axios from 'axios';
import winston from 'winston';
import {
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_ERROR
} from './constants/messages';

/**
 * Fetches the Ethereum balance of a given address.
 *
 * @param rpcUrl - The RPC URL.
 * @param address - The Ethereum address to check.
 * @returns The balance in Ether or null if an error occurs.
 */
export async function fetchBalance(rpcUrl: string, address: string): Promise<bigint | null> {
    const data = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
    };

    try {
        const response = await axios.post<{ result: string }>(rpcUrl, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        const balanceWeiHex: string = response.data.result;
        const balanceWei: bigint = BigInt(balanceWeiHex);
        winston.info(FETCH_BALANCE_SUCCESS(balanceWei));
        return balanceWei;
    } catch (error) {
        let message
        if (error instanceof Error)
            message = error.message
        else
            message = String(error)
        winston.error(FETCH_BALANCE_ERROR(message));
        return null;
    }
}
