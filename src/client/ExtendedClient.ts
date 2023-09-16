import {
  ActivityType,
  Client,
  Collection,
  PresenceUpdateStatus
} from 'discord.js';
import { Command } from '../types/Command.js';
import { config } from '../systems/config.js';
import { handleCommands } from '../systems/command.js';
import { handleEvents } from '../systems/event.js';

export default class extends Client {
  public commands: Collection<string, Command> = new Collection();
  public commandsArray: Command['structure'][] = [];

  public command = class {
    public structure: Command['structure'];
    public run: Command['run'];
    constructor(data: Command) {
      this.structure = data.structure;
      this.run = data.run;
    }
  };

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

  public start() {
    this.loginDiscord();
    handleEvents();
    handleCommands();
  }

  private loginDiscord() {
    try {
      this.login(config.CLIENT_TOKEN);
    } catch (e) {
      console.error('Please provide a valid CLIENT_TOKEN!');
      process.exit();
    }
  }
}
