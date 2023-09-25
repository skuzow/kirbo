import ExtendedClient from './client/ExtendedClient.js';
import { processEnv } from './systems/configSystem.js';
import { connectDB } from './systems/mongoSystem.js';

processEnv();
await connectDB();
export const client = new ExtendedClient();
client.start();
