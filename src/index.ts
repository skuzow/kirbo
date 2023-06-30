import ExtendedClient from './client/ExtendedClient.js';
import { processEnv } from './systems/config.js';

processEnv();

export const client = new ExtendedClient();
client.start();
