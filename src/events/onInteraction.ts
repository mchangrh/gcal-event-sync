import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { Logger } from "../utils/logger";

export const onInteraction = async (
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      for (const Command of CommandList) {
        if (interaction.commandName === Command.data.name) {
          await Command.run(interaction as ChatInputCommandInteraction).catch(
            err => {
              Logger.error("caught error in " + interaction.commandName);
              Logger.error(err);
              interaction.reply({ content: "An error occured" });
            }
          );
          break;
        }
      }
    }
  } catch (err) {
    Logger.error(err);
  }
};
