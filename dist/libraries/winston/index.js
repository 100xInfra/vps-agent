"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Winston Logger.
 *
 * This module is responsible for creating a logger using the Winston library.
 *
 * @version 1.0.2
 * @author Vineet Agarwal
 */
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const utils_1 = __importDefault(require("@/utils"));
const path_1 = __importDefault(require("path"));
const singleton_1 = require("@/helpers/singleton");
// Destructure the format object from winston
const { combine, timestamp, printf, colorize } = winston_1.format;
/**
 * Logger class.
 *
 * This class has all the functions to log messages at different levels.
 *
 * @version 1.0.2
 * @extends Singleton
 * @class Logger
 */
class Logger extends singleton_1.Singleton {
    constructor() {
        super(); // Ensures singleton behavior via base class
        // Custom format for the logger
        const customFormat = printf(({ level, message, timestamp }) => {
            return `[ ${utils_1.default.formatTimestamp(timestamp)} ] - ${level} - ${message}`;
        });
        this.logger = (0, winston_1.createLogger)({
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                debug: 4,
            },
            format: combine(timestamp(), customFormat),
            transports: [
                new winston_1.transports.Console({
                    format: combine(colorize(), timestamp(), customFormat),
                }),
                new winston_daily_rotate_file_1.default({
                    filename: path_1.default.join("logs", "info-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "info",
                    maxFiles: "14d",
                }),
                new winston_daily_rotate_file_1.default({
                    filename: path_1.default.join("logs", "error-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "error",
                    maxFiles: "14d",
                }),
                new winston_daily_rotate_file_1.default({
                    filename: path_1.default.join("logs", "http-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "http",
                    maxFiles: "14d",
                }),
                new winston_daily_rotate_file_1.default({
                    filename: path_1.default.join("logs", "warn-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    level: "warn",
                    maxFiles: "14d",
                }),
            ],
        });
    }
    static getInstance() {
        return singleton_1.Singleton.getInstance.call(this);
    }
    /**
     * Logs an info message.
     * @param {...any} args - Multiple arguments to log.
     */
    info(...args) {
        this.logger.info(this.formatMessage(args));
    }
    /**
     * Logs an error message.
     * @param {...any} args - Multiple arguments to log.
     */
    error(...args) {
        this.logger.error(this.formatMessage(args));
    }
    /**
     * Logs a warning message.
     * @param {...any} args - Multiple arguments to log.
     */
    warn(...args) {
        this.logger.warn(this.formatMessage(args));
    }
    /**
     * Logs an HTTP message.
     * @param {...any} args - Multiple arguments to log.
     */
    http(...args) {
        this.logger.log("http", this.formatMessage(args));
    }
    /**
     * Logs a debug message.
     * @param {...any} args - Multiple arguments to log.
     */
    debug(...args) {
        this.logger.debug(this.formatMessage(args));
    }
    /**
     * Formats multiple arguments into a single log message.
     * @param {any[]} args - The arguments to format.
     * @returns {string} - The formatted log message.
     */
    formatMessage(args) {
        return args
            .map((arg) => (arg instanceof Error ? `${arg.message} \nStack Trace: ${arg.stack}` : JSON.stringify(arg)))
            .join(" | ");
    }
}
exports.default = Logger;
