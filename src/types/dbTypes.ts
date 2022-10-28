import { Document, WithId } from "mongodb";
import { mappedEvent } from "./discordEvents";

export type discordSnowflake = string;

export interface guildSettings {
  guild_id: discordSnowflake;
  calendar_id: string;
  days: number;
  channel: discordSnowflake;
}

export interface guildSettingsDocument extends WithId<Document>, guildSettings {
  //
}

export interface calendarEventDocument extends WithId<Document> {
  guild_id: discordSnowflake;
  events: mappedEvent[];
}
