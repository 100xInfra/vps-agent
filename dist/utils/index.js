"use strict";
/**
 * Utils class
 *
 * Contains utility functions that are used throughout the application.
 *
 * @version 1.0.0
 * @author Vineet Agarwal.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
class Utils {
    /**
     * Formats a timestamp string to the format yyyy-MM-dd HH:mm:ss
     *
     * @param timestamp
     * @returns string The formatted timestamp in the format yyyy-MM-dd HH:mm:ss
     */
    static formatTimestamp(timestamp) {
        const date = (0, date_fns_1.parseISO)(timestamp);
        return (0, date_fns_1.format)(date, "yyyy-MM-dd HH:mm:ss");
    }
}
exports.default = Utils;
