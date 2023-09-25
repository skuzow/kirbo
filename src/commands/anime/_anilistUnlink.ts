import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { existUser, deleteUser } from '../../services/userService.js';

export async function processUnlinkQuery(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const discordId: string = interaction.user.id;
  if (await existUser(discordId)) {
    await deleteUser(discordId);
    await interaction.reply(`Discord account successfully unlinked!`);
  } else {
    await interaction.reply(`Your discord account is not linked yet!`);
  }
}
