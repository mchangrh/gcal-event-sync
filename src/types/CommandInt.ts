import {
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export interface CommandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: (
    interaction: ChatInputCommandInteraction
  ) => Promise<InteractionResponse<boolean> | void>;
}
