/**
 * Cron service
 * 
 * This service is responsible for running cron jobs
 * 
 * @version 1.0.0
 * @class Cron
 * @author Vineet Agarwal
 */
import cron from 'node-cron';
import Logger from "@/libraries/winston";
import SystemMonitor from '@/services/systemMonitor';

/**
 * Cron class
 */
export class Cron {
    private Log = Logger.getInstance();
    private systemMonitor = SystemMonitor.getInstance();
    public async start() {
        this.Log.info("Starting cron service");
        cron.schedule('* * * * *', async () => {
            this.Log.info("Cron job running");
            this.systemMonitor.sendStatsToBackend();
        });
    }
}