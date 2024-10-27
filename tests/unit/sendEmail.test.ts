import { sendEmail } from '../../src/sendEmail';
import nodemailer from 'nodemailer';
import winston from 'winston';
import { testConfig } from "../types/testConfig"
import {
    EMAIL_SUBJECT_LOW_BALANCE,
    EMAIL_ETHEREUM_BALANCE_CHECKER,
    BALANCE_BELOW_THRESHOLD
} from '../../src/constants/messages';

jest.mock('nodemailer');
jest.mock('winston');

const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
const mockedWinston = winston as jest.Mocked<typeof winston>;

describe('sendEmail unit tests', () => {

    const mockSendMail = jest.fn().mockResolvedValue({});

    beforeAll(() => {
        mockedNodemailer.createTransport.mockReturnValue({
            sendMail: mockSendMail
        } as any);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email', async () => {
        const balanceBelowThreshold = testConfig.threshold - BigInt("1");

        await sendEmail(testConfig, balanceBelowThreshold);

        const expectedMailOptions = {
            from: `${EMAIL_ETHEREUM_BALANCE_CHECKER} <${testConfig.emailConfig.emailAddress}>`,
            to: testConfig.emailConfig.recipientEmail,
            subject: EMAIL_SUBJECT_LOW_BALANCE,
            text: BALANCE_BELOW_THRESHOLD(testConfig.ethAddress, balanceBelowThreshold, testConfig.threshold)
        };

        expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
            host: testConfig.emailConfig.smtpServer,
            port: testConfig.emailConfig.smtpPort,
            auth: {
                user: testConfig.emailConfig.emailAddress,
                pass: testConfig.emailConfig.emailPassword
            }
        });

        expect(mockSendMail).toHaveBeenCalledWith(expectedMailOptions);
    });
});
