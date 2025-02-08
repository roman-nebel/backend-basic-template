import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import log from "../logger/logger.js";

import layers from "./layers/layers.js";

type ServerConfigType = {
  port?: number;
  layers?: string[];
};

const { SERVER_PORT = 9001 } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

export async function startServer({
  port = Number(SERVER_PORT),
  ...config
}: Partial<ServerConfigType> = {}) {
  return new Promise((resolve, reject) => {
    try {
      (config.layers || Object.keys(layers)).forEach((layer: string) => {
        app.use(`/${layer}`, layers[layer]);
      });

      app.listen(port, () => {
        log.info(`Server started on port ${port}`);
        resolve("");
      });
    } catch (e) {
      reject("Failed to start server");
      log.trace(e);
    }
  });
}
