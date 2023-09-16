import axios, { AxiosResponse } from 'axios';
import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  Colors
} from 'discord.js';
import { client } from '../../index.js';
import {
  Anilist,
  AnimeEntry,
  AnimeNextAiringEpisode
} from '../../types/Anilist.js';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

export async function processLinkQuery(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  try {
    const username = String(interaction.options.get('username')?.value);
    // TODO: Implement linking
    const response: Anilist = await requestQuery(username);
    const infoEmbed: EmbedBuilder = generateInfoEmbed(response);
    await interaction.reply({ embeds: [infoEmbed] });
  } catch {
    await interaction.reply(`Username doesn't exist in Anilist`);
  }
}

async function requestQuery(username: string): Promise<Anilist> {
  return axios
    .post(ANILIST_GRAPHQL_URL, { query: generateQuery(username) })
    .then((response: AxiosResponse) => response.data.data.MediaListCollection);
}

function generateInfoEmbed(response: Anilist): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.LuminousVividPink)
    .setTitle('Successfully linked ' + response.user.name + ' Anime List')
    .setDescription('Current airing animes')
    .setThumbnail(response.user.avatar.medium)
    .setFields(filterAiringAnimes(response.lists[0].entries))
    .setTimestamp()
    .setFooter({
      text: 'Profile: ' + response.user.name,
      iconURL: client.user?.avatarURL() || undefined
    });
}

interface AnimeField {
  name: string;
  value: string;
}

function filterAiringAnimes(animes: AnimeEntry[]): AnimeField[] {
  return animes
    .filter((anime) => anime.media.nextAiringEpisode !== null)
    .map((anime) => {
      return {
        name: anime.media.title.english,
        value: generateAnimeValue(anime.media.nextAiringEpisode)
      };
    });
}

function generateAnimeValue(anime: AnimeNextAiringEpisode | null): string {
  if (anime === null) return 'No airing episodes';
  const { days, hours, remainingMinutes } = convertSecondsToDaysHoursMinutes(
    anime.timeUntilAiring
  );
  return `Episode ${anime.episode} will air in ${days} days, ${hours} hours, and ${remainingMinutes} minutes`;
}

function convertSecondsToDaysHoursMinutes(seconds: number): {
  days: number;
  hours: number;
  remainingMinutes: number;
} {
  const minutes: number = seconds / 60;
  const minutesInDay: number = 60 * 24;
  const minutesInHour = 60;

  const days: number = Math.floor(minutes / minutesInDay);
  const remainingMinutesAfterDays: number = minutes % minutesInDay;

  const hours: number = Math.floor(remainingMinutesAfterDays / minutesInHour);
  const remainingMinutes: number = Math.floor(
    remainingMinutesAfterDays % minutesInHour
  );

  return {
    days,
    hours,
    remainingMinutes
  };
}

function generateQuery(username: string): string {
  return `
    query MediaListCollection {
        MediaListCollection(
            userName: "${username}"
            type: ANIME
            status: CURRENT
            forceSingleCompletedList: true
        ) {
            user {
                id
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
                        id
                        siteUrl
                        coverImage {
                            medium
                        }
                        nextAiringEpisode {
                            id
                            airingAt
                            timeUntilAiring
                            episode
                            mediaId
                        }
                    }
                }
            }
        }
    }
  `;
}
