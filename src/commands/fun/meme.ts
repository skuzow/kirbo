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

export interface Meme {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
  preview: string[];
}

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Replies with a random meme'),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    const meme: Meme = await getMeme();
    const memeEmbed: EmbedBuilder = generateMemeEmbed(meme);
    await interaction.reply({ embeds: [memeEmbed] });
  }
});

async function getMeme(): Promise<Meme> {
  const meme: Meme = await axios('https://meme-api.com/gimme').then(function (
    response: AxiosResponse
  ) {
    return response.data;
  });
  return meme;
}

function generateMemeEmbed(meme: Meme) {
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
