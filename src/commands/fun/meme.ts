import axios, { AxiosResponse } from 'axios';
import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import {
  CacheType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import { Meme } from '../../types/Meme.js';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Replies with a random meme'),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    try {
      const meme: Meme = await getMeme();
      const memeEmbed: EmbedBuilder = generateMemeEmbed(meme);
      await interaction.reply({ embeds: [memeEmbed] });
    } catch {
      await interaction.reply('There was an error getting the meme');
    }
  }
});

async function getMeme(): Promise<Meme> {
  return axios('https://meme-api.com/gimme').then(
    (response: AxiosResponse) => response.data
  );
}

function generateMemeEmbed(meme: Meme): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.LuminousVividPink)
    .setTitle(meme.title)
    .setDescription(meme.postLink)
    .setImage(meme.url)
    .setTimestamp()
    .setFooter({
      text: 'From Reddit by ' + meme.author,
      iconURL: client.user?.avatarURL() || undefined
    });
}
