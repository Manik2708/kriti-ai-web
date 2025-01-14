import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', // Log level (e.g., info, error, warn)
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp(),
    ),
    transports: [
        new winston.transports.Console(), // Console logging
    ],
});

export default logger;