import ExtendedClient from './client/ExtendedClient.js';
import { processEnv } from './systems/config.js';
import { connectDB } from './systems/mongo.js';

processEnv();
await connectDB();
export const client = new ExtendedClient();
client.start();
