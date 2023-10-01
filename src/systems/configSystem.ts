import { config as env } from 'dotenv';
import { resolve } from 'path';
import { existsSync, copyFileSync } from 'fs';

const path: string = process.cwd();
const envFile: string =
  process.env.NODE_ENV === 'development' ? '.dev.env' : '.env';
const envFilePath: string = resolve(path, envFile);

export const config: NodeJS.ProcessEnv = process.env;

export function processEnv() {
  const isEnvGenerated: boolean = existsSync(envFile);
  if (!isEnvGenerated) generateEnv();
  env({ path: envFilePath });
}

function generateEnv() {
  const envTemplatePath = resolve(path, 'src/config/.env');
  copyFileSync(envTemplatePath, envFilePath);
  console.log('Check generated env and fill it with config');
  process.exit();
}
