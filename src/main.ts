import "dotenv/config";
import log from "./services/logger/logger.js";

import { startServer } from "./services/express/express.js";
import { connectToDB } from "./services/mongodb/mongodb.js";

try {
  await connectToDB();
  await startServer();
  log.info("All systems are running. Let's rock!");
} catch (e) {
  log.error("Hewston, we have a problem!");
  log.debug(e);
  process.exit(1);
}
