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
import os from "os";
import osu from "os-utils";
import si from "systeminformation";
import axios from "axios";
import { Singleton } from "@/helpers/singleton";
import Logger from "@/libraries/winston";

class SystemMonitor extends Singleton {

    private Log        = Logger.getInstance();
    private backendUrl = "http://localhost:3001";

    /**
     * Fetch CPU Usage
     */
    public async getCPUUsage(): Promise<number> {
        return new Promise((resolve) => {
            osu.cpuUsage((usage) => {
                resolve(usage * 100);
            });
        });
    }

    /**
     * Fetch Memory Usage
     */
    public getMemoryUsage(): { total: number; free: number; used: number } {
        const total = os.totalmem() / (1024 * 1024); // Convert to MB
        const free = os.freemem() / (1024 * 1024);
        const used = total - free;
        return { total, free, used };
    }

    /**
     * Fetch Disk Usage
     */
    public async getDiskUsage(): Promise<{ total: number; free: number; used: number }> {
        const diskData = await si.fsSize();
        const total = diskData.reduce((acc, disk) => acc + disk.size, 0) / (1024 * 1024 * 1024); // GB
        const free = diskData.reduce((acc, disk) => acc + disk.available, 0) / (1024 * 1024 * 1024);
        const used = total - free;
        return { total, free, used };
    }

    /**
     * Fetch Network Traffic
     */
    public async getNetworkStats() {
        const network = await si.networkStats();
        return network.map(n => ({
            iface: n.iface,
            rx_bytes: n.rx_bytes, // Received
            tx_bytes: n.tx_bytes, // Transmitted
        }));
    }

    /**
     * Fetch Process Monitoring Stats
     */
    public async getProcessStats() {
        const processes = await si.processes();
        return {
            total: processes.all,
            running: processes.running,
            topProcesses: processes.list
                .sort((a, b) => b.cpu - a.cpu) // Sort by CPU usage
                .slice(0, 10), // Top 10 processes
        };
    }

    /**
     * Fetch Disk I/O Stats
     */
    public async getDiskIOStats() {
        const diskIO = await si.disksIO();
        return {
            read: diskIO.rIO,
            write: diskIO.wIO,
        };
    }

    /**
     * Fetch Load Average
     */
    public getLoadAverage(): number {
        return os.loadavg()[0]; // 1-minute load average
    }

    /**
     * Fetch System Uptime & Reboots
     */
    public async getUptimeAndReboots() {
        const uptime = os.uptime();
        const bootTime = await si.time();
        return { uptime, bootTime: bootTime.uptime };
    }

    /**
     * Fetch Open Ports & Active Connections
     */
    public async getOpenPorts() {
        const networkConnections = await si.networkConnections();
        return networkConnections.filter(conn => conn.state === "LISTEN").map(conn => ({
            protocol: conn.protocol,
            localPort: conn.localPort,
            remotePort: conn.peerPort,
            process: conn.process,
        }));
    }

    /**
     * Fetch Running Services Status
     */
    public async getServiceStatus() {
        const services = await si.services("*"); 
        return services.map(service => ({
            name: service.name,
            running: service.running,
            cpu: service.cpu, // CPU usage %
            mem: service.mem, // Memory usage (MB)
        }));
    }

    /**
     * Send system stats to the backend
     * 
     */
    public async sendStatsToBackend() {
        try {
            const stats = await this.getSystemStats();
            await axios.post(this.backendUrl, stats);
            this.Log.info("✔️ Stats sent successfully.");
        } catch (error) {
            this.Log.error("An unexpected error occurred", error);
        }
    }


    /**
     * Get all system stats
     */
    public async getSystemStats() {
        return {
            cpuUsage: await this.getCPUUsage(),
            memoryUsage: this.getMemoryUsage(),
            diskUsage: await this.getDiskUsage(),
            networkStats: await this.getNetworkStats(),
            processStats: await this.getProcessStats(),
            diskIOStats: await this.getDiskIOStats(),
            loadAverage: this.getLoadAverage(),
            uptimeAndReboots: await this.getUptimeAndReboots(),
            openPorts: await this.getOpenPorts(),
            serviceStatus: await this.getServiceStatus(),
        };
    }
}



export default SystemMonitor;