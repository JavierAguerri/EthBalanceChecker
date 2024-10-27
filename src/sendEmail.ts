import nodemailer from 'nodemailer';
import winston from 'winston';
import { FinalConfig } from './types/finalConfig';
import {
    EMAIL_SENT,
    EMAIL_FAILED,
    EMAIL_SUBJECT_LOW_BALANCE,
    EMAIL_ETHEREUM_BALANCE_CHECKER,
    BALANCE_BELOW_THRESHOLD
} from './constants/messages';

/**
 * Sends an email notification about the low Ethereum balance.
 *
 * @param config - Configuration object containing RPC URL, Ethereum address, threshold, and email settings.
 * @param balance - The current Ethereum balance.
 */
export async function sendEmail(config: FinalConfig, balance: bigint): Promise<void> {
    const { ethAddress, threshold, emailConfig } = config;
    const { smtpServer, smtpPort, emailAddress, emailPassword, recipientEmail } = emailConfig;

    try {
        const transporter = nodemailer.createTransport({
            host: smtpServer,
            port: smtpPort,
            auth: {
                user: emailAddress,
                pass: emailPassword
            }
        });
        const mailOptions = {
            from: `${EMAIL_ETHEREUM_BALANCE_CHECKER} <${emailAddress}>`,
            to: recipientEmail,
            subject: EMAIL_SUBJECT_LOW_BALANCE,
            text: BALANCE_BELOW_THRESHOLD(ethAddress, balance, threshold)
        };

        await transporter.sendMail(mailOptions);
        winston.info(EMAIL_SENT(recipientEmail));
    } catch (error) {
        let message
        if (error instanceof Error)
            message = error.message
        else
            message = String(error)
        winston.error(EMAIL_FAILED(message));
    }
}
