import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  Colors
} from 'discord.js';
import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import axios, { AxiosResponse } from 'axios';
import {
  Anilist,
  AnimeEntry,
  AnimeNextAiringEpisode
} from '../../types/Anilist.js';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('anilist')
    .setDescription('Anilist notification commands')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('link')
        .setDescription('Links anilist username with discord account')
        .addStringOption((option) =>
          option
            .setRequired(true)
            .setName('username')
            .setDescription('Anilist username to link')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unlink')
        .setDescription('Unlinks anilist username with discord account')
    ),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    const subCommand: string = interaction.options.getSubcommand();
    if (subCommand === 'link') {
      const username = String(interaction.options.get('username')?.value);
      processLinkQuery(interaction, username);
    } else if (subCommand === 'unlink') {
      // TODO: Implement unlinking
      await interaction.reply('Unlinking anilist account');
    }
  }
});

async function processLinkQuery(
  interaction: ChatInputCommandInteraction<CacheType>,
  username: string
) {
  try {
    // TODO: Implement linking
    const response: Anilist = await requestQuery(username);
    const infoEmbed: EmbedBuilder = generateInfoEmbed(response);
    await interaction.reply({ embeds: [infoEmbed] });
  } catch {
    await interaction.reply('Invalid username');
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
