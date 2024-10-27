import { FinalConfig } from '../../src/types/finalConfig';

const threshold = BigInt("10000000000000000");

export const testConfig: FinalConfig = {
    rpcUrl: 'rpcUrl',
    ethAddress: 'ethAddress',
    threshold: threshold,
    emailConfig: {
        smtpServer: 'smtpServer',
        smtpPort: 587,
        emailAddress: 'email@example.com',
        emailPassword: 'emailPassword',
        recipientEmail: 'recipient@example.com'
    }
};