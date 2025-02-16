/**
 * Winston Logger.
 * 
 * This module is responsible for creating a logger using the Winston library.
 * 
 * @version 1.0.2
 * @author Vineet Agarwal
 */
import winston, { format, createLogger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Utils from "@/utils";
import path from "path";
import { Singleton } from "@/helpers/singleton";

// Destructure the format object from winston
const { combine, timestamp, printf, colorize } = format;

/**
 * Logger class.
 * 
 * This class has all the functions to log messages at different levels.
 * 
 * @version 1.0.2
 * @extends Singleton
 * @class Logger
 */
class Logger extends Singleton {
    private logger: winston.Logger;

    protected constructor() {
        super(); // Ensures singleton behavior via base class

        // Custom format for the logger
        const customFormat = printf(({ level, message, timestamp }) => {
            return `[ ${Utils.formatTimestamp(timestamp as string)} ] - ${level} - ${message}`;
        });

        this.logger = createLogger({
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                debug: 4,
            },
            format: combine(timestamp(), customFormat),
            transports: [
                new transports.Console({
                    format: combine(colorize(), timestamp(), customFormat),
                }),
                new DailyRotateFile({
                    filename: path.join("logs", "info-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "info",
                    maxFiles: "14d",
                }),
                new DailyRotateFile({
                    filename: path.join("logs", "error-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "error",
                    maxFiles: "14d",
                }),
                new DailyRotateFile({
                    filename: path.join("logs", "http-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "http",
                    maxFiles: "14d",
                }),
                new DailyRotateFile({
                    filename: path.join("logs", "warn-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "warn",
                    maxFiles: "14d",
                }),
            ],
        });
    }

    public static getInstance(): Logger {
        return Singleton.getInstance.call(this) as Logger;
    }

    /**
     * Logs an info message.
     * @param {...any} args - Multiple arguments to log.
     */
    public info(...args: any[]) {
        this.logger.info(this.formatMessage(args));
    }

    /**
     * Logs an error message.
     * @param {...any} args - Multiple arguments to log.
     */
    public error(...args: any[]) {
        this.logger.error(this.formatMessage(args));
    }

    /**
     * Logs a warning message.
     * @param {...any} args - Multiple arguments to log.
     */
    public warn(...args: any[]) {
        this.logger.warn(this.formatMessage(args));
    }

    /**
     * Logs an HTTP message.
     * @param {...any} args - Multiple arguments to log.
     */
    public http(...args: any[]) {
        this.logger.log("http", this.formatMessage(args));
    }

    /**
     * Logs a debug message.
     * @param {...any} args - Multiple arguments to log.
     */
    public debug(...args: any[]) {
        this.logger.debug(this.formatMessage(args));
    }

    /**
     * Formats multiple arguments into a single log message.
     * @param {any[]} args - The arguments to format.
     * @returns {string} - The formatted log message.
     */
    private formatMessage(args: any[]): string {
        return args
            .map((arg) => (arg instanceof Error ? `${arg.message} \nStack Trace: ${arg.stack}` : JSON.stringify(arg)))
            .join(" | ");
    }
}

export default Logger;