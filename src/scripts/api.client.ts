export const API_HOST = 'transient-vhx7xcvtna-ue.a.run.app';

export interface Song {
  trackName: string;
  artistName: string;
  description?: string;
  image?: string;
  audio: string;
  remainingPlays: number;
}
