import pino from "pino";

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
            messageFormat: '{msg} {args}'
        }
    }
});