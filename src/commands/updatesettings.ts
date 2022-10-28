// import types
import { SlashCommandBuilder } from "discord.js";
import { CommandInt } from "../types/CommandInt";
import { guildSettings, guildSettingsDocument } from "../types/dbTypes";
// custom types
// modules
import { collections } from "../utils/db";

export const updatesettings: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("updatesettings")
    .setDescription("Update settings for the server")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Google Calendar ID")
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName("days")
        .setMinValue(1)
        .setMaxValue(14)
        .setDescription("Set number of days to pull events for")
        .setRequired(false)
    )
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Fallback channel to bind events to")
        .setRequired(false)
    ) as SlashCommandBuilder,
  run: async interaction => {
    const calendar_id = interaction.options.getString("id");
    const days = interaction.options.getInteger("days");
    const channel = interaction.options.getString("channel");
    // set up DB
    const guilds = collections.guilds;
    // construct guild settings
    const newSettings: guildSettings = {
      guild_id: interaction.guildId,
      calendar_id,
      days,
      channel,
    };
    // sanitize new settings
    for (const [key, value] of Object.values(newSettings)) {
      if (!value) delete newSettings[key];
    }
    // check against db
    const guildSettings = (await guilds.findOne({
      guild_id: interaction.guildId,
    })) as guildSettingsDocument;
    if (guildSettings) {
      await guilds.updateOne(
        {
          guild_id: interaction.guildId,
        },
        {
          newSettings,
        }
      );
      return interaction.reply({
        content: "Updated existing settings",
        ephemeral: true,
      });
    }
  },
};
