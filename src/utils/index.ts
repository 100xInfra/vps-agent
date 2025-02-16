/**
 * Utils class
 * 
 * Contains utility functions that are used throughout the application.
 * 
 * @version 1.0.0
 * @author Vineet Agarwal. 
 */

import { format, parseISO } from "date-fns";

class Utils {
    /**
     * Formats a timestamp string to the format yyyy-MM-dd HH:mm:ss
     * 
     * @param timestamp 
     * @returns string The formatted timestamp in the format yyyy-MM-dd HH:mm:ss
     */
    static formatTimestamp(timestamp: string): string {
        const date = parseISO(timestamp);
        return format(date, "yyyy-MM-dd HH:mm:ss");
    }
}

export default Utils;