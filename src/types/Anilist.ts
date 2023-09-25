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
  title: AnimeTitle;
  nextAiringEpisode: AnimeNextAiringEpisode | null;
}

export interface AnimeTitle {
  english: string;
}

export interface AnimeNextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}
