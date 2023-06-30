import { CacheType, Interaction } from 'discord.js';
import { client } from '../../index.js';
import { Command } from '../../types/Command.js';

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;
  const command: Command | undefined = client.commands.get(
    interaction.commandName
  );
  if (!command) return;
  try {
    command?.run(client, interaction);
  } catch (err) {
    console.error(err);
  }
});
