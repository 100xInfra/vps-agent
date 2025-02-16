/**
 * Base class for singleton pattern classes.
 * 
 * @version 1.0.0
 * @author Vineet Agarwal
 */
export class Singleton {
    /**
     * The instance of the class.
     * 
     * @private {any} instance The instance of the class.
     */
    private static instance: any;

    /**
     * Returns the instance of the class.
     * 
     * @returns The instance of the class.
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;

    }

    /**
     * Prevents the class from being instantiated.
     */
    protected constructor() {
        if (new.target === Singleton) {
            throw new Error("Cannot instantiate a singleton class.");
        }
    }
}


 