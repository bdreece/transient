import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { Song } from './api.client';
import { API_HOST } from './api.client';

const upload = async (song: Song, progress: (event: ProgressEvent) => void) => {
  const { trackName, artistName, description, image, audio, remainingPlays } =
    song;
  const options: AxiosRequestConfig = {
    url: `https://${API_HOST}/api/songs`,
    method: 'POST',
    headers: {
      //'Access-Control-Request-Method': 'POST',
      'Content-Type': 'application/json',
      //Origin: origin,
    },
    data: JSON.stringify({
      trackName,
      artistName,
      description,
      image,
      audio,
      remainingPlays,
    }),
    onUploadProgress: progress,
    responseType: 'json',
  };
  const response = await axios.request(options);

  return response.status == 200 ? response : undefined;
};

export default upload;
