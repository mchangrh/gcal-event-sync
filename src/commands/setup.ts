// import types
import { SlashCommandBuilder } from "discord.js";
import { CommandInt } from "../types/CommandInt";
import { guildSettings, guildSettingsDocument } from "../types/dbTypes";
// custom types
// modules
import { collections } from "../utils/db";

export const setup: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot for your server")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Google Calendar ID")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("days")
        .setMinValue(1)
        .setMaxValue(14)
        .setDescription("Set number of days to pull events for")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Fallback channel to bind events to")
        .setRequired(true)
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
    // create user
    await guilds.insertOne(newSettings);
    return interaction.reply({
      content: `Successfully added calendar ${calendar_id} to server`,
    });
  },
};
