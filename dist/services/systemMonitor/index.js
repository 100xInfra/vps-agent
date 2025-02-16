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
/**
 * System Monitor Service
 *
 * This service provides various system monitoring functionalities
 * like CPU usage, memory usage, disk usage, network stats, process stats, etc.
 *
 * @version 1.0.0
 * @class SystemMonitor
 * @singleton
 * @author Vineet Agarwal
 *
 */
const os_1 = __importDefault(require("os"));
const os_utils_1 = __importDefault(require("os-utils"));
const systeminformation_1 = __importDefault(require("systeminformation"));
const axios_1 = __importDefault(require("axios"));
const singleton_1 = require("@/helpers/singleton");
const winston_1 = __importDefault(require("@/libraries/winston"));
class SystemMonitor extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.Log = winston_1.default.getInstance();
        this.backendUrl = "http://localhost:3001";
    }
    /**
     * Fetch CPU Usage
     */
    getCPUUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                os_utils_1.default.cpuUsage((usage) => {
                    resolve(usage * 100);
                });
            });
        });
    }
    /**
     * Fetch Memory Usage
     */
    getMemoryUsage() {
        const total = os_1.default.totalmem() / (1024 * 1024); // Convert to MB
        const free = os_1.default.freemem() / (1024 * 1024);
        const used = total - free;
        return { total, free, used };
    }
    /**
     * Fetch Disk Usage
     */
    getDiskUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            const diskData = yield systeminformation_1.default.fsSize();
            const total = diskData.reduce((acc, disk) => acc + disk.size, 0) / (1024 * 1024 * 1024); // GB
            const free = diskData.reduce((acc, disk) => acc + disk.available, 0) / (1024 * 1024 * 1024);
            const used = total - free;
            return { total, free, used };
        });
    }
    /**
     * Fetch Network Traffic
     */
    getNetworkStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const network = yield systeminformation_1.default.networkStats();
            return network.map(n => ({
                iface: n.iface,
                rx_bytes: n.rx_bytes, // Received
                tx_bytes: n.tx_bytes, // Transmitted
            }));
        });
    }
    /**
     * Fetch Process Monitoring Stats
     */
    getProcessStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const processes = yield systeminformation_1.default.processes();
            return {
                total: processes.all,
                running: processes.running,
                topProcesses: processes.list
                    .sort((a, b) => b.cpu - a.cpu) // Sort by CPU usage
                    .slice(0, 10), // Top 10 processes
            };
        });
    }
    /**
     * Fetch Disk I/O Stats
     */
    getDiskIOStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const diskIO = yield systeminformation_1.default.disksIO();
            return {
                read: diskIO.rIO,
                write: diskIO.wIO,
            };
        });
    }
    /**
     * Fetch Load Average
     */
    getLoadAverage() {
        return os_1.default.loadavg()[0]; // 1-minute load average
    }
    /**
     * Fetch System Uptime & Reboots
     */
    getUptimeAndReboots() {
        return __awaiter(this, void 0, void 0, function* () {
            const uptime = os_1.default.uptime();
            const bootTime = yield systeminformation_1.default.time();
            return { uptime, bootTime: bootTime.uptime };
        });
    }
    /**
     * Fetch Open Ports & Active Connections
     */
    getOpenPorts() {
        return __awaiter(this, void 0, void 0, function* () {
            const networkConnections = yield systeminformation_1.default.networkConnections();
            return networkConnections.filter(conn => conn.state === "LISTEN").map(conn => ({
                protocol: conn.protocol,
                localPort: conn.localPort,
                remotePort: conn.peerPort,
                process: conn.process,
            }));
        });
    }
    /**
     * Fetch Running Services Status
     */
    getServiceStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield systeminformation_1.default.services("*");
            return services.map(service => ({
                name: service.name,
                running: service.running,
                cpu: service.cpu, // CPU usage %
                mem: service.mem, // Memory usage (MB)
            }));
        });
    }
    /**
     * Send system stats to the backend
     *
     */
    sendStatsToBackend() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.getSystemStats();
                yield axios_1.default.post(this.backendUrl, stats);
                this.Log.info("✔️ Stats sent successfully.");
            }
            catch (error) {
                this.Log.error("An unexpected error occurred", error);
            }
        });
    }
    /**
     * Get all system stats
     */
    getSystemStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                cpuUsage: yield this.getCPUUsage(),
                memoryUsage: this.getMemoryUsage(),
                diskUsage: yield this.getDiskUsage(),
                networkStats: yield this.getNetworkStats(),
                processStats: yield this.getProcessStats(),
                diskIOStats: yield this.getDiskIOStats(),
                loadAverage: this.getLoadAverage(),
                uptimeAndReboots: yield this.getUptimeAndReboots(),
                openPorts: yield this.getOpenPorts(),
                serviceStatus: yield this.getServiceStatus(),
            };
        });
    }
}
exports.default = SystemMonitor;
