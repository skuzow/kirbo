import {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import ExtendedClient from '../client/ExtendedClient.js';

export interface Command {
  structure:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | ContextMenuCommandBuilder;
  run: (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => void;
}
