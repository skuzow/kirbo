import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { readdirSync } from 'fs';
import path from 'path';
import { Command } from '../types/Command.js';
import { client } from '../index.js';
import { __dirname } from '../constants/dirname.js';

export async function handleCommands() {
  await searchCommands();
  deployCommands();
}

async function searchCommands() {
  const commandFolders: string[] = readdirSync(
    path.join(__dirname, '../commands')
  );
  for (const commandFolder of commandFolders) {
    const commandFiles: string[] = readdirSync(
      path.join(__dirname, `../commands/${commandFolder}`)
    );
    for (const commandFile of commandFiles) {
      await loadCommand(commandFolder, commandFile);
    }
  }
}

async function loadCommand(commandFolder: string, commandFile: string) {
  if (commandFile.startsWith('_')) return;
  const module: Command = (
    await import(`../commands/${commandFolder}/${commandFile}`)
  ).default;
  client.commands.set(module.structure.name, module);
  client.commandsArray.push(module.structure);
  console.log('Loaded new command: ' + commandFile);
}

async function deployCommands() {
  const rest: REST = new REST().setToken(config.CLIENT_TOKEN ?? '');
  try {
    console.log('Started loading app commands...');
    await rest.put(Routes.applicationCommands(config.CLIENT_ID ?? ''), {
      body: client.commandsArray
    });
    console.log('Finished loading app commands.');
  } catch (e) {
    console.error('Please provide a valid CLIENT_ID!');
    process.exit();
  }
}
