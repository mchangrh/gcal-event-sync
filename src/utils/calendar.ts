import gCalendar from "@googleapis/calendar";
import { Snowflake } from "discord.js";
import { DateTime } from "luxon";
import { client } from "../index";
import * as config from "../config.json";
import {
  discordSnowflake,
  guildSettingsDocument,
  calendarEventDocument,
} from "../types/dbTypes";
import { mappedEvent } from "../types/discordEvents";
import { collections } from "../utils/db";

const auth = new gCalendar.auth.GoogleAuth({
  keyFile: config.keyfile,
  scopes: ["https://www.googleapis.com/auth/calendar.events.readonly"],
});

// databases
const guilds = collections.guilds;
const calendars = collections.events;

const isoDate = (date: string): string => DateTime.fromISO(date).toISO();

async function getEvents(guild: discordSnowflake) {
  // get settings
  const guildSettings = (await guilds.findOne({
    guild_id: guild,
  })) as guildSettingsDocument;
  // setup calendar
  const calendar = gCalendar.calendar({ version: "v3", auth });
  const params = {
    calendarId: guildSettings.calendar_id,
    timeMin: DateTime.now().toISO(),
    timeMax: DateTime.now()
      .plus({ days: guildSettings.days })
      .endOf("day")
      .toISO(), // get all events of last day
    singleEvents: true,
    orderBy: "startTime",
    timeZone: "UTC",
  };
  // start pulling events
  const events = await calendar.events.list(params);
  // filter events by events not in db
  const oldEventDocument = (await calendars.findOne({
    guild_id: guild,
  })) as calendarEventDocument;
  const oldEvents = oldEventDocument?.events ?? [];
  const newEvents: mappedEvent[] = events.data.items
    .filter(
      newEvent =>
        !oldEvents.some(
          oldEvent =>
            oldEvent.id === newEvent.id &&
            DateTime.fromISO(oldEvent.updated).toMillis() <
              DateTime.fromISO(newEvent.updated).toMillis()
        )
      // map events to mappedEvent
    )
    .map(event => ({
      id: event.id,
      summary: event?.summary ?? event?.description,
      start: isoDate(event.start.dateTime),
      end: isoDate(event.end.dateTime),
      updated: event.updated,
      location: event.location ?? event.hangoutLink ?? "",
    }));
  return newEvents;
}

async function addEventsToGuild(
  guild_id: discordSnowflake,
  events: mappedEvent[]
) {
  // get settings
  const guildSettings = (await guilds.findOne({
    guild_id,
  })) as guildSettingsDocument;
  // add events to db
  calendars.updateOne(
    {
      guild_id,
    },
    {
      $push: {
        events: {
          $each: events,
        },
      },
    },
    {
      upsert: true,
    }
  );
  // add events to discord guild
  const guild = await client.guilds.fetch(guild_id);
  const guildEvents = guild.scheduledEvents;
  events.forEach(event => {
    guildEvents.create({
      name: event.summary,
      channel: guildSettings.channel as Snowflake,
      scheduledStartTime: event.start,
      scheduledEndTime: event.end,
      privacyLevel: 2,
      entityType: event.location ? 3 : 2,
    });
  });
}
