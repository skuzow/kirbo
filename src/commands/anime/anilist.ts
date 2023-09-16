import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType
} from 'discord.js';
import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import { processLinkQuery } from './_anilistLink.js';
import { processUnlinkQuery } from './_anilistUnlink.js';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('anilist')
    .setDescription('Anilist notification commands')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('link')
        .setDescription('Links anilist username with discord account')
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName('username')
            .setDescription('Anilist username to link')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unlink')
        .setDescription('Unlinks anilist username with discord account')
    ),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => processCommand(interaction)
});

function processCommand(interaction: ChatInputCommandInteraction<CacheType>) {
  const subCommand: string = interaction.options.getSubcommand();
  if (subCommand === 'link') processLinkQuery(interaction);
  else if (subCommand === 'unlink') processUnlinkQuery(interaction);
}
