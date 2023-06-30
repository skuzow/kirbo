import { Client, Collection, REST, Routes } from 'discord.js';
import { Command } from '../types/Command.js';
import { config } from '../systems/config.js';
import { readdirSync } from 'fs';

export default class extends Client {
  public commands: Collection<string, Command> = new Collection();
  public commandsArray: Command['structure'][] = [];

  constructor() {
    super({ intents: ['Guilds'] });
  }

  public async start() {
    this._login();
    await this._loadModules();
    this._deploy();
  }

  private async _login() {
    await this.login(config.CLIENT_TOKEN);
  }

  private async _loadModules() {
    await this._loadCommands();
    await this._loadEvents();
  }

  private async _loadCommands() {
    const commandFolders: string[] = readdirSync('./dist/commands/');
    for (const commandFolder of commandFolders) {
      const commandFiles: string[] = readdirSync(
        `./dist/commands/${commandFolder}`
      );
      for (const commandFile of commandFiles) {
        const module: Command = (
          await import(`../commands/${commandFolder}/${commandFile}`)
        ).default;
        this.commands.set(module.structure.name, module);
        this.commandsArray.push(module.structure);
        console.log('Loaded new command: ' + commandFile);
      }
    }
  }

  private async _loadEvents() {
    const eventFolders: string[] = readdirSync('./dist/events/');
    for (const eventFolder of eventFolders) {
      const eventFiles: string[] = readdirSync(`./dist/events/${eventFolder}`);
      for (const eventFile of eventFiles) {
        await import(`../events/${eventFolder}/${eventFile}`);
        console.log('Loaded new event: ' + eventFile);
      }
    }
  }

  private async _deploy() {
    const rest: REST = new REST().setToken(config.CLIENT_TOKEN ?? '');
    try {
      console.log('Started loading app commands...');
      await rest.put(Routes.applicationCommands(config.CLIENT_ID ?? ''), {
        body: this.commandsArray
      });
      console.log('Finished loading app commands.');
    } catch (e) {
      console.error(e);
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
