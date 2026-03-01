import db from "../db.js";
import { stopAllMonitors } from "../scheduler/index.js";
import { stopCleanupJob } from "./cleanup.js";

function shutdown() {
  console.log("Shutting down OwlOps... 🦉(Gracefully 💅!)");

  stopAllMonitors();
  stopCleanupJob();

  db.close();

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
