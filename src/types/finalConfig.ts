import { EmailConfig } from './emailConfig';

export interface FinalConfig {
    rpcUrl: string;
    ethAddress: string;
    threshold: bigint;
    emailConfig: EmailConfig;
}