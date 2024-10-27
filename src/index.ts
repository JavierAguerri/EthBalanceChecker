import { checkBalance } from './checkBalance';
import winston from 'winston';
import dotenv from 'dotenv';
import config from 'config';
import { FinalConfig } from './types/finalConfig';

winston.configure({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: 'balance_check.log' }),
        new winston.transports.Console()
    ]
});

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

const finalConfig: FinalConfig = {
    rpcUrl: config.get<string>('rpcUrl'),
    ethAddress: config.get<string>('ethAddress'),
    threshold: config.get<bigint>('threshold'),
    emailConfig: {
        smtpServer: config.get<string>('email.smtpServer'),
        smtpPort: config.get<number>('email.smtpPort'),
        emailAddress: config.get<string>('email.emailAddress'),
        emailPassword: process.env.EMAIL_PASSWORD || '',
        recipientEmail: config.get<string>('email.recipientEmail')
    }
};

checkBalance(finalConfig);
