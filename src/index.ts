// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { config } from 'dotenv';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'development' ? '.dev.env' : '.env';
const envFilePath = resolve(process.cwd(), envFile);
config({ path: envFilePath });

// eslint-disable-next-line no-console
console.log(process.env.PRINT);
