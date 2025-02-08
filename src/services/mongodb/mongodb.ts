import log from "../logger/logger.js";

import { MongoClient } from "mongodb";

const { DB_URL = "mongodb://localhost:27017" } = process.env;

const db = new MongoClient(DB_URL);

export async function connectToDB() {
  try {
    await db.connect();
    log.info("Connected to the DB cluster!");
  } catch (e) {
    log.trace(e);
    throw new Error("Failed to connect to the DB cluster!");
  }
}
