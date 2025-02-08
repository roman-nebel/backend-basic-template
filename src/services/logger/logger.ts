import log4js, { Appender } from "log4js";

type ConfigType = {
  appenders: {
    [key: string]: Appender;
  };
  categories: {
    [key: string]: { appenders: string[]; level: string };
  };
};

const {
  NODE_ENV = "default",
  SLACK_BOT_TOKEN,
  SLACK_CHANNEL_ID,
  SLACK_BOT_USERNAME = "Server",
} = process.env;

const isProduction = NODE_ENV === "production";

const baseLayout = {
  type: "pattern",
  pattern: `%[[%p] %d{dd.MM.yyyy hh:mm:ss:SSS}%] - %m`,
};

const slackLayout = {
  type: "pattern",
  pattern: `%[[%p] [%%d{dd.MM.yyyy hh:mm:ss}%]${
    isProduction ? " / [%h]" : ""
  } - %m`,
};

const config: ConfigType = {
  appenders: {
    console: { type: "console", layout: baseLayout },
    file: {
      type: "file",
      layout: baseLayout,
      filename: "logs/app.log",
      maxLogSize: 10485760, // 10MB
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "debug" },
    development: { appenders: ["console"], level: "debug" },
    production: { appenders: ["console", "file"], level: "debug" },
  },
};

if (SLACK_BOT_TOKEN && SLACK_CHANNEL_ID) {
  config.appenders.slack = {
    type: "@log4js-node/slack",
    token: SLACK_BOT_TOKEN,
    channel_id: SLACK_CHANNEL_ID,
    username: SLACK_BOT_USERNAME,
    layout: slackLayout,
  };
  config.appenders.slackInfo = {
    type: "logLevelFilter",
    level: "info",
    appender: "slack",
  };

  config.categories.production.appenders.push("slackInfo");
}

log4js.configure(config);

export default log4js.getLogger(NODE_ENV);
