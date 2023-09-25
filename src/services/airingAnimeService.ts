import { HydratedDocument } from 'mongoose';
import AiringAnime, { IAiringAnime } from '../models/AiringAnime.js';
import { AnimeEntry } from '../types/Anilist.js';
import { IUser } from '../models/User.js';

export async function createAiringAnime(
  anime: AnimeEntry
): Promise<HydratedDocument<IAiringAnime>> {
  return await AiringAnime.create({
    name: anime.media.title.english,
    episode: anime.media.nextAiringEpisode?.episode,
    airingDate: generateAiringDate(anime.media.nextAiringEpisode?.airingAt || 0)
  });
}

function generateAiringDate(airingAt: number): Date {
  return new Date(airingAt * 1000);
}

export async function deleteAiringAnime(name: string) {
  await AiringAnime.deleteOne({ name: name });
}

export async function getAiringAnime(
  name: string
): Promise<HydratedDocument<IAiringAnime> | null> {
  return await AiringAnime.findOne({ name: name });
}

export async function getOrCreateAiringAnime(
  anime: AnimeEntry
): Promise<HydratedDocument<IAiringAnime> | null> {
  const animeTitle: string = anime.media.title.english;
  if (await existAiringAnime(animeTitle)) {
    return await getAiringAnime(animeTitle);
  }
  return await createAiringAnime(anime);
}

export async function existAiringAnime(name: string): Promise<boolean> {
  return !!(await getAiringAnime(name));
}

export async function insertUserAiringAnimesData(
  user: HydratedDocument<IUser>,
  animes: AnimeEntry[]
) {
  // Promise.all for async map
  await Promise.all(
    animes.map(async (anime: AnimeEntry) => {
      const foundAnime: HydratedDocument<IAiringAnime> | null =
        await getOrCreateAiringAnime(anime);
      if (!foundAnime) return;
      await subscribeUserToAiringAnime(foundAnime, user);
    })
  );
}

export async function subscribeUserToAiringAnime(
  anime: HydratedDocument<IAiringAnime>,
  user: HydratedDocument<IUser>
) {
  if (anime.subscribers.includes(user._id)) return;
  anime.subscribers.push(user._id);
  await anime.save();
}

export async function unSuscribeUserFromAiringAnimes(userId: string) {
  await AiringAnime.updateMany(
    { subscribers: userId },
    { $pull: { subscribers: userId } }
  );
}
