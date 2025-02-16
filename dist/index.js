"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("@/services/cron");
const winston_1 = __importDefault(require("@/libraries/winston"));
const Log = winston_1.default.getInstance();
const cron = new cron_1.Cron();
cron.start();
Log.info("Application started");
