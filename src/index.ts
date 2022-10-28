// types
import { Client } from "discord.js";
// events
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
// modules
import { connectToDatabase } from "./utils/db";
import format from "format-duration";
// config
import { discord } from "./config.json";
import { Logger } from "./utils/logger";

export const client = new Client({
  intents: [],
});

// discord events
client.on("ready", async () => await onReady(client));
client.on(
  "interactionCreate",
  async interaction => await onInteraction(interaction)
);
client.on("rateLimit", data => {
  Logger.debug("rate limited" + JSON.stringify(data));
  Logger.debug("lifted in " + format(data.timeout));
});

// start setup
connectToDatabase().then(() => client.login(discord.token));

// start timers
/*
const HOUR = 3600000;
// update calendars every 1 hour
setInterval(() => onUpdateStreams(client), HOUR);
*/
