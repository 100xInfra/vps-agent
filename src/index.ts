import { Cron } from "./services/cron";
import Logger from "./libraries/winston";

const Log = Logger.getInstance();

const cron = new Cron();
cron.start();

Log.info("Application started");
