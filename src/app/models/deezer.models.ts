export interface DeezerPlaylistResponse {
  data: Playlist[];
  total: number;
  next?: string;
}

export interface Playlist {
  id: number;
  title: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  picture_medium: string;
  checksum: string;
  tracklist: string;
  creation_date: string; // Consider using Date type with proper transformation
  md5_image: string;
  picture_type: string;
  time_add: number;
  time_mod: number;
  creator: Creator;
  type: string;
}

export interface Creator {
  id: number;
  name: string;
  tracklist: string;
  type: string;
}

export interface DeezerPlaylistDetailResponse {
  id: number;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  nb_tracks: number;
  link: string;
  picture_medium: string;
  tracks: Track[];
  creator: Creator;
  type: string;
}

export interface Track {
  id: number;
  title: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  artist: Artist;
}

export interface Artist {
  id: number;
  name: string;
  link: string;
  type: string;
}

export interface DeezerTracksResponse {
  data: Track[];
  total: number;
  next?: string;
}
