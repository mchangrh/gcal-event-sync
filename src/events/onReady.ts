import { Logger } from "../utils/logger";
// config
import { discord } from "../config.json";
// types
import { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
// custom types
import { CommandList } from "../commands/_CommandList";
// modules

export const onReady = async (client: Client): Promise<void> => {
  const rest = new REST({ version: "9" }).setToken(discord.token);
  const commandData: {
    name: string;
    description?: string;
    type?: number;
    options?: APIApplicationCommandOption[];
  }[] = [];

  CommandList.forEach(command => {
    commandData.push(
      command.data.toJSON() as {
        name: string;
        description?: string;
        type?: number;
        options?: APIApplicationCommandOption[];
      }
    );
  });
  await rest.put(
    Routes.applicationGuildCommands(discord.clientId, discord.guildId),
    {
      body: commandData,
    }
  );
  await rest.put(
    Routes.applicationGuildCommands(discord.clientId, discord.devGuildId),
    {
      body: commandData,
    }
  );
  Logger.info(client.user.tag + " is ready!");
};
