"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
/**
 * Base class for singleton pattern classes.
 *
 * @version 1.0.0
 * @author Vineet Agarwal
 */
class Singleton {
    /**
     * Returns the instance of the class.
     *
     * @returns The instance of the class.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    /**
     * Prevents the class from being instantiated.
     */
    constructor() {
        if (new.target === Singleton) {
            throw new Error("Cannot instantiate a singleton class.");
        }
    }
}
exports.Singleton = Singleton;
