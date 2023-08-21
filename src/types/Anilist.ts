export interface Anilist {
  user: AnilistUser;
  lists: AnimeList[];
}

export interface AnilistUser {
  id: number;
  name: string;
  avatar: AnilistAvatar;
}

export interface AnilistAvatar {
  medium: string;
}

export interface AnimeList {
  entries: AnimeEntry[];
}

export interface AnimeEntry {
  media: AnimeMedia;
}

export interface AnimeMedia {
  id: number;
  title: AnimeTitle;
  siteUrl: string;
  coverImage: AnilistAvatar;
  nextAiringEpisode: AnimeNextAiringEpisode | null;
}

export interface AnimeTitle {
  english: string;
}

export interface AnimeNextAiringEpisode {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  mediaId: number;
}
