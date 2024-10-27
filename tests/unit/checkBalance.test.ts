import winston from 'winston';
import { checkBalance } from '../../src/checkBalance';
import { fetchBalance } from '../../src/fetchBalance';
import { sendEmail } from '../../src/sendEmail';
import { FinalConfig } from '../../src/types/finalConfig';
import {
    BALANCE_BELOW_THRESHOLD,
    BALANCE_ABOVE_THRESHOLD,
    BALANCE_FETCH_FAILED
} from '../../src/constants/messages';

import { testConfig } from "../types/testConfig"

jest.mock('../../src/fetchBalance');
jest.mock('../../src/sendEmail');
jest.mock('winston');

const mockedFetchBalance = fetchBalance as jest.MockedFunction<typeof fetchBalance>;
const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockedWinston = winston as jest.Mocked<typeof winston>;

describe('checkBalance unit tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email and log a warning when balance is fractionally below the threshold', async () => {
        const ethBalance = testConfig.threshold - BigInt(1);
        mockedFetchBalance.mockResolvedValue(ethBalance);
        await checkBalance(testConfig);
        expect(mockedWinston.warn).toHaveBeenCalledWith(BALANCE_BELOW_THRESHOLD(testConfig.ethAddress, ethBalance, testConfig.threshold));
        expect(mockedSendEmail).toHaveBeenCalledWith(testConfig, ethBalance);
    });

    it('should log an info message and not send an email when balance is right on the threshold', async () => {
        const ethBalance = testConfig.threshold;
        mockedFetchBalance.mockResolvedValue(ethBalance);
        await checkBalance(testConfig);
        expect(mockedWinston.info).toHaveBeenCalledWith(BALANCE_ABOVE_THRESHOLD(testConfig.ethAddress, ethBalance, testConfig.threshold));
        expect(mockedSendEmail).not.toHaveBeenCalled();
    });

    it('should log an info message and not send an email when balance is fractionally above the threshold', async () => {
        const ethBalance = testConfig.threshold + BigInt(1);
        mockedFetchBalance.mockResolvedValue(ethBalance);
        await checkBalance(testConfig);
        expect(mockedWinston.info).toHaveBeenCalledWith(BALANCE_ABOVE_THRESHOLD(testConfig.ethAddress, ethBalance, testConfig.threshold));
        expect(mockedSendEmail).not.toHaveBeenCalled();
    });

    it('should log an error when balance fetching fails and not send an email', async () => {
        mockedFetchBalance.mockResolvedValue(null);
        await checkBalance(testConfig);
        expect(mockedWinston.error).toHaveBeenCalledWith(BALANCE_FETCH_FAILED);
        expect(mockedSendEmail).not.toHaveBeenCalled();
    });
});
