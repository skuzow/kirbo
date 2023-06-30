import { config } from 'dotenv';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'development' ? '.dev.env' : '.env';
const envFilePath = resolve(process.cwd(), envFile);
config({ path: envFilePath });
console.log(process.env.PRINT);
