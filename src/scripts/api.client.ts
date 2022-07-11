export const API_HOST = 'localhost:8080';

export interface File {
  data: string;
  format: string;
}

export interface Song {
  trackName: string;
  artistName: string;
  description?: string;
  image?: File;
  audio: File;
  remainingPlays: number;
}
