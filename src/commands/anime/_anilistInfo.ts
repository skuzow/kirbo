import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder
} from 'discord.js';
import { existUser, getUser } from '../../services/userService.js';
import { Anilist } from '../../types/Anilist.js';
import { generateInfoEmbed, requestAnilistQuery } from './_anilistUtils.js';

export async function processInfoQuery(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const discordId: string = interaction.user.id;
  if (await existUser(discordId)) {
    const username: string = (await getUser(discordId))
      ?.anilistUsername as string;
    const response: Anilist = await requestAnilistQuery(username);
    const infoEmbed: EmbedBuilder = generateInfoEmbed(
      response,
      `Linked account: ${response.user.name}`
    );
    await interaction.reply({ embeds: [infoEmbed] });
  } else {
    await interaction.reply(`Your discord account is not linked yet!`);
  }
}
