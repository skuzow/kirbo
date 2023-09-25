import { HydratedDocument } from 'mongoose';
import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  Colors
} from 'discord.js';
import { client } from '../../index.js';
import { Anilist, AnimeEntry } from '../../types/Anilist.js';
import { IUser } from '../../models/User.js';
import {
  filterAiringAnimes,
  generateEmbedAiringAnimes,
  requestAnilistQuery
} from './_anilistUtils.js';
import { insertUserAiringAnimesData } from '../../services/airingAnimeService.js';
import {
  existUser,
  getOrCreateUser,
  getUser
} from '../../services/userService.js';

export async function processLinkQuery(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  try {
    const discordId: string = interaction.user.id;
    if (await existUser(discordId)) {
      const user: HydratedDocument<IUser> | null = await getUser(discordId);
      await interaction.reply(`\
        Your discord account is already linked with ${user?.anilistUsername} Anilist. If you want to unlink use \`/anilist unlink\` command!
      `);
    } else {
      const username = String(interaction.options.get('username')?.value);
      const response: Anilist = await requestAnilistQuery(username);
      await insertUserData(response, discordId);
      const infoEmbed: EmbedBuilder = generateInfoEmbed(response);
      await interaction.reply({ embeds: [infoEmbed] });
    }
  } catch (e) {
    console.error(e);
    await interaction.reply(`Username doesn't exist in Anilist`);
  }
}

async function insertUserData(response: Anilist, discordId: string) {
  const user: HydratedDocument<IUser> | null = await getOrCreateUser(
    discordId,
    response.user.name
  );
  if (!user) return;
  const airingAnimes: AnimeEntry[] = filterAiringAnimes(
    response.lists[0].entries
  );
  await insertUserAiringAnimesData(user, airingAnimes);
}

function generateInfoEmbed(response: Anilist): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.LuminousVividPink)
    .setTitle(`Successfully linked ${response.user.name} Anilist`)
    .setDescription('Current airing animes on linked account')
    .setThumbnail(response.user.avatar.medium)
    .setFields(generateEmbedAiringAnimes(response.lists[0].entries))
    .setTimestamp()
    .setFooter({
      text: `Profile: ${response.user.name}`,
      iconURL: client.user?.avatarURL() || undefined
    });
}
