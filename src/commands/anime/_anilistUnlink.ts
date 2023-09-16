import { ChatInputCommandInteraction, CacheType } from 'discord.js';

export async function processUnlinkQuery(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  // TODO: Implement unlinking
  await interaction.reply('Unlinking is not implemented yet');
}
