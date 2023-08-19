import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType
} from 'discord.js';
import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import axios from 'axios';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('anilist')
    .setDescription('Replies with a random meme')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('username')
        .setDescription('Links anilist username with discord account')
    )
    .addBooleanOption((option) =>
      option
        .setRequired(true)
        .setName('active')
        .setDescription('Enables or disables anime notifications')
    ),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    const username = String(getInteractionOptionValue(interaction, 'username'));
    const active = Boolean(getInteractionOptionValue(interaction, 'active'));
    if (await isValidUser(username)) {
      await interaction.reply('valid username');
    } else {
      await interaction.reply('invalid username');
    }
  }
});

function getInteractionOptionValue(
  interaction: ChatInputCommandInteraction<CacheType>,
  optionName: string
): string | number | boolean | undefined {
  return interaction.options.get(optionName)?.value;
}

async function isValidUser(username: string): Promise<boolean> {
  try {
    await axios({
      url: ANILIST_GRAPHQL_URL,
      method: 'post',
      data: {
        query: `
          query User {
            User(name: "${username}") {
                name
            }
          }
        `
      }
    });
    return true;
  } catch {
    return false;
  }
}
