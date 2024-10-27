import { fetchBalance } from './fetchBalance';
import { sendEmail } from './sendEmail';
import { FinalConfig } from './types/finalConfig';
import winston from 'winston';
import {
    BALANCE_BELOW_THRESHOLD,
    BALANCE_ABOVE_THRESHOLD,
    BALANCE_FETCH_FAILED,
} from './constants/messages';

/**
 * Checks the Ethereum balance and sends a notification if it's below the threshold.
 *
 * @param config - Configuration object containing RPC URL, Ethereum address, threshold, and email settings.
 */
export async function checkBalance(config: FinalConfig): Promise<void> {
    const { rpcUrl, ethAddress, threshold } = config;

    const balance = await fetchBalance(rpcUrl, ethAddress);
    if (balance !== null) {
        if (balance < threshold) {
            winston.warn(BALANCE_BELOW_THRESHOLD(ethAddress, balance, threshold));
            await sendEmail(config, balance);
        } else {
            winston.info(BALANCE_ABOVE_THRESHOLD(ethAddress, balance, threshold));
        }
    } else {
        winston.error(BALANCE_FETCH_FAILED);
    }
}
