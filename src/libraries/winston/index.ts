/**
 * Winston Logger.
 * 
 * This module is responsible for creating a logger using the Winston library.
 * 
 * @version 1.0.0
 * @author Vineet Agarwal
 */
import winston, { format, createLogger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Utils from "../../utils/utils";
import path from "path";
import "dotenv/config";
import { Singleton  } from "../../helpers/singleton";

// Destructure the format object from winston
const { combine, timestamp, printf, colorize } = format;


/**
 * Logger class.
 * 
 * This class has all the functions to log messages at different levels.
 * 
 * @version 1.0.0
 * @extends Singleton
 * @class Logger
 */
class Logger extends Singleton {
    /**
     * @var {winston.Logger} logger The logger object.
     */
    private logger: winston.Logger;

    protected constructor() {
        super(); // Ensures singleton behavior via base class

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

    // Use the correct type signature that matches the base class
    public static getInstance(): Logger {
        return Singleton.getInstance.call(this) as Logger;
    }

    public info(message: string) {
        this.logger.info(message);
    }

    public error(message: string) {
        this.logger.error(message);
    }

    public warn(message: string) {
        this.logger.warn(message);
    }

    public http(message: string) {
        this.logger.log("http", message);
    }

    public debug(message: string) {
        this.logger.debug(message);
    }
}

export default Logger;