import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    await interaction.reply({
      content: 'Pong!'
    });
  }
});
