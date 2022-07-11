export const API_HOST = 'localhost:8080';

export interface Song {
  trackName: string;
  artistName: string;
  description?: string;
  file: string;
  format: string;
  remainingPlays: number;
}
