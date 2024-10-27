import axios from 'axios';
import winston from 'winston';
import { fetchBalance } from '../../src/fetchBalance';
import {
    ETH_0_PERIOD_1_IN_WEI,
    ETH_0_PERIOD_MANY_9_IN_WEI,
    ETH_0_PERIOD_1_MANY_0_AND_1_IN_WEI
} from '../constants/constants';

jest.mock('axios');
jest.mock('winston');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedWinston = winston as jest.Mocked<typeof winston>;

describe('fetchBalance unit tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the correct balance in ETH when API call is successful', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { result: ETH_0_PERIOD_1_IN_WEI },
            status: 200
        } as any);
        const balance = await fetchBalance("", "");
        expect(balance).toBe(BigInt("10000000000000000"));
    });

    it('should return the correct balance in ETH when the balance is fractionally below 0.1', async () => {
        // @ts-ignore
        mockedAxios.post.mockResolvedValue({
            data: { result: ETH_0_PERIOD_MANY_9_IN_WEI },
            status: 200
        });
        const balance = await fetchBalance("", "");
        expect(balance).toBe(BigInt("9999999999999999"));
    });

    it('should return the correct balance in ETH when the balance is fractionally above 0.1', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { result: ETH_0_PERIOD_1_MANY_0_AND_1_IN_WEI },
            status: 200
        } as any);
        const balance = await fetchBalance("", "");
        expect(balance).toBe(BigInt("10000000000000001"));
    });

    it('should NOT return a rounded balance in ETH when the balance is fractionally below 0.1', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { result: ETH_0_PERIOD_MANY_9_IN_WEI },
            status: 200
        } as any);
        const balance = await fetchBalance("", "");
        expect(balance).not.toBe(BigInt("10000000000000000"));
    });

    it('should NOT return a rounded balance in ETH when the balance is fractionally above 0.1', async () => {
        // @ts-ignore
        mockedAxios.post.mockResolvedValue({
            data: { result: ETH_0_PERIOD_1_MANY_0_AND_1_IN_WEI },
            status: 200
        });
        const balance = await fetchBalance("", "");
        expect(balance).not.toBe(BigInt("10000000000000000"));
    });

    it('should return null and log an error when API call fails', async () => {
        mockedAxios.post.mockRejectedValue("");
        const balance = await fetchBalance("", "");
        expect(balance).toBeNull();
        expect(mockedWinston.error).toHaveBeenCalled();
    });
});
