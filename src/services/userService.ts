import { HydratedDocument } from 'mongoose';
import User, { IUser } from '../models/User.js';

export async function createUser(
  discordId: string,
  anilistUsername: string
): Promise<HydratedDocument<IUser>> {
  return await User.create({
    discordId: discordId,
    anilistUsername: anilistUsername
  });
}

export async function deleteUser(discordId: string) {
  await User.deleteOne({ discordId: discordId });
}

export async function getUser(
  discordId: string
): Promise<HydratedDocument<IUser> | null> {
  return await User.findOne({ discordId: discordId });
}

export async function getOrCreateUser(
  discordId: string,
  username: string
): Promise<HydratedDocument<IUser> | null> {
  if (await existUser(discordId)) return await getUser(discordId);
  return await createUser(discordId, username);
}

export async function existUser(discordId: string): Promise<boolean> {
  return !!(await getUser(discordId));
}
