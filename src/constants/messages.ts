export const FETCH_BALANCE_SUCCESS = (balance: bigint): string =>
    `Fetched balance: ${balance} wei`;

export const FETCH_BALANCE_ERROR = (errorMessage: string): string =>
    `Error fetching balance: ${errorMessage}`;

export const BALANCE_FETCH_FAILED = 'Failed to retrieve balance.';

export const BALANCE_BELOW_THRESHOLD = (ethAddress: string, balance: bigint, threshold: bigint): string =>
    `The balance of address ${ethAddress} is currently ${balance} wei. It has fallen below the threshold of ${threshold} wei.`;

export const BALANCE_ABOVE_THRESHOLD = (ethAddress: string, balance: bigint, threshold: bigint): string =>
    `The balance of address ${ethAddress} is currently ${balance} wei. It is equal or larger than the threshold of ${threshold} wei.`;

export const EMAIL_ETHEREUM_BALANCE_CHECKER = "Ethereum Balance Checker";

export const EMAIL_SENT = (recipientEmail: string): string =>
    `Email sent to ${recipientEmail} regarding low balance.`;

export const EMAIL_FAILED = (errorMessage: string): string =>
    `Failed to send email: ${errorMessage}`;

export const EMAIL_SUBJECT_LOW_BALANCE = 'Low Ethereum Balance Alert';