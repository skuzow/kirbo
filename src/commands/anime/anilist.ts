import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  Colors
} from 'discord.js';
import ExtendedClient from '../../client/ExtendedClient.js';
import { client } from '../../index.js';
import axios from 'axios';
import {
  Anilist,
  AnimeEntry,
  AnimeNextAiringEpisode
} from '../../types/Anilist.js';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

export default new client.command({
  structure: new SlashCommandBuilder()
    .setName('anilist')
    .setDescription(
      'Links anilist username with discord account to receive anime notifications'
    )
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('username')
        .setDescription('Anilist username to link')
    )
    .addBooleanOption((option) =>
      option
        .setRequired(true)
        .setName('active')
        .setDescription('Enables or disables anime notifications')
    ),
  run: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction<CacheType>
  ) => {
    const username = String(getInteractionOptionValue(interaction, 'username'));
    const active = Boolean(getInteractionOptionValue(interaction, 'active'));
    return processQuery(interaction, username, active);
  }
});

function getInteractionOptionValue(
  interaction: ChatInputCommandInteraction<CacheType>,
  optionName: string
): string | number | boolean | undefined {
  return interaction.options.get(optionName)?.value;
}

async function processQuery(
  interaction: ChatInputCommandInteraction<CacheType>,
  username: string,
  active: boolean
) {
  try {
    const response: Anilist = await requestQuery(username);
    const infoEmbed: EmbedBuilder = generateInfoEmbed(response);
    return await interaction.reply({ embeds: [infoEmbed] });
  } catch {
    return await interaction.reply('Invalid username');
  }
}

async function requestQuery(username: string): Promise<Anilist> {
  const response = await axios({
    url: ANILIST_GRAPHQL_URL,
    method: 'post',
    data: { query: generateQuery(username) }
  });
  return response.data.data.MediaListCollection;
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
  return (
    'Episode ' +
    anime.episode +
    ' will air in ' +
    Math.floor(anime.timeUntilAiring / 60) +
    ' hours'
  );
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
