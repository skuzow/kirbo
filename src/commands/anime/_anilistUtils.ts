import axios, { AxiosResponse } from 'axios';
import prettyMilliseconds from 'pretty-ms';
import {
  Anilist,
  AnimeEntry,
  AnimeNextAiringEpisode
} from '../../types/Anilist.js';
import { Colors, EmbedBuilder } from 'discord.js';
import { client } from '../../index.js';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

export async function requestAnilistQuery(username: string): Promise<Anilist> {
  return axios
    .post(ANILIST_GRAPHQL_URL, { query: generateAnilistParams(username) })
    .then((response: AxiosResponse) => response.data.data.MediaListCollection);
}

function generateAnilistParams(username: string): string {
  return `
    query MediaListCollection {
        MediaListCollection(
            userName: "${username}"
            type: ANIME
            status: CURRENT
            forceSingleCompletedList: true
        ) {
            user {
                name
                avatar {
                    medium
                }
            }
            lists {
                entries {
                    media {
                        title {
                            english
                        }
                        nextAiringEpisode {
                            airingAt
                            timeUntilAiring
                            episode
                        }
                    }
                }
            }
        }
    }
  `;
}

interface AiringAnimeEmbedField {
  name: string;
  value: string;
}

export function generateInfoEmbed(
  response: Anilist,
  titleMessage: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.LuminousVividPink)
    .setTitle(titleMessage)
    .setURL(`https://anilist.co/user/${response.user.name}`)
    .setDescription('Current airing animes on linked account')
    .setThumbnail(response.user.avatar.medium)
    .setFields(generateEmbedAiringAnimes(response.lists[0].entries))
    .setTimestamp()
    .setFooter({
      text: `Profile: ${response.user.name}`,
      iconURL: client.user?.avatarURL() || undefined
    });
}

function generateEmbedAiringAnimes(
  animes: AnimeEntry[]
): AiringAnimeEmbedField[] {
  return filterAiringAnimes(animes).map((anime) => {
    return {
      name: anime.media.title.english,
      value: generateAnimeValue(anime.media.nextAiringEpisode)
    };
  });
}

export function filterAiringAnimes(animes: AnimeEntry[]): AnimeEntry[] {
  return animes.filter((anime) => anime.media.nextAiringEpisode !== null);
}

function generateAnimeValue(anime: AnimeNextAiringEpisode | null): string {
  if (!anime) return 'No airing episodes';
  const airingHumanReadable: string = prettyMilliseconds(
    anime.timeUntilAiring * 1000
  );
  return `Episode ${anime.episode} will air in ${airingHumanReadable}`;
}
