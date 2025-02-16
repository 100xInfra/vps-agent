"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cron = void 0;
/**
 * Cron service
 *
 * This service is responsible for running cron jobs
 *
 * @version 1.0.0
 * @class Cron
 * @author Vineet Agarwal
 */
const node_cron_1 = __importDefault(require("node-cron"));
const winston_1 = __importDefault(require("@/libraries/winston"));
const systemMonitor_1 = __importDefault(require("@/services/systemMonitor"));
/**
 * Cron class
 */
class Cron {
    constructor() {
        this.Log = winston_1.default.getInstance();
        this.systemMonitor = systemMonitor_1.default.getInstance();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Log.info("Starting cron service");
            node_cron_1.default.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
                this.Log.info("Cron job running");
                this.systemMonitor.sendStatsToBackend();
            }));
        });
    }
}
exports.Cron = Cron;
