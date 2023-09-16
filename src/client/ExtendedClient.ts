import {
  ActivityType,
  Client,
  Collection,
  PresenceUpdateStatus,
  REST,
  Routes
} from 'discord.js';
import { Command } from '../types/Command.js';
import { config } from '../systems/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class extends Client {
  public commands: Collection<string, Command> = new Collection();
  public commandsArray: Command['structure'][] = [];

  constructor() {
    super({
      intents: ['Guilds'],
      presence: {
        activities: [
          {
            name: 'Chonky Kirbo D:',
            type: ActivityType.Playing
          }
        ],
        status: PresenceUpdateStatus.Idle
      }
    });
  }

  public async start() {
    this.loginDiscord();
    await this.loadModules();
    this.deploy();
  }

  private async loginDiscord() {
    try {
      await this.login(config.CLIENT_TOKEN);
    } catch (e) {
      console.error('Please provide a valid CLIENT_TOKEN!');
      process.exit();
    }
  }

  private async loadModules() {
    await this.searchCommands();
    await this.searchEvents();
  }

  private async searchCommands() {
    const commandFolders: string[] = readdirSync(
      path.join(__dirname, '../commands')
    );
    for (const commandFolder of commandFolders) {
      const commandFiles: string[] = readdirSync(
        path.join(__dirname, `../commands/${commandFolder}`)
      );
      for (const commandFile of commandFiles) {
        await this.loadCommand(commandFolder, commandFile);
      }
    }
  }

  private async loadCommand(commandFolder: string, commandFile: string) {
    if (commandFile.startsWith('_')) return;
    const module: Command = (
      await import(`../commands/${commandFolder}/${commandFile}`)
    ).default;
    this.commands.set(module.structure.name, module);
    this.commandsArray.push(module.structure);
    console.log('Loaded new command: ' + commandFile);
  }

  private async searchEvents() {
    const eventFolders: string[] = readdirSync(
      path.join(__dirname, '../events/')
    );
    for (const eventFolder of eventFolders) {
      const eventFiles: string[] = readdirSync(
        path.join(__dirname, `../events/${eventFolder}`)
      );
      for (const eventFile of eventFiles) {
        await this.loadEvent(eventFolder, eventFile);
      }
    }
  }

  private async loadEvent(eventFolder: string, eventFile: string) {
    await import(`../events/${eventFolder}/${eventFile}`);
    console.log('Loaded new event: ' + eventFile);
  }

  private async deploy() {
    const rest: REST = new REST().setToken(config.CLIENT_TOKEN ?? '');
    try {
      console.log('Started loading app commands...');
      await rest.put(Routes.applicationCommands(config.CLIENT_ID ?? ''), {
        body: this.commandsArray
      });
      console.log('Finished loading app commands.');
    } catch (e) {
      console.error('Please provide a valid CLIENT_ID!');
      process.exit();
    }
  }

  public command = class {
    public structure: Command['structure'];
    public run: Command['run'];
    constructor(data: Command) {
      this.structure = data.structure;
      this.run = data.run;
    }
  };
}
