import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { API_HOST, Song } from './api.client';

const download = async (
  id: string,
  progress: (event: ProgressEvent) => void
) => {
  const options: AxiosRequestConfig = {
    url: `https://${API_HOST}/api/songs/${id}`,
    headers: {
      //'Access-Control-Request-Method': 'GET',
      'Content-Type': 'application/json',
      //Origin: origin,
    },
    responseType: 'json',
    onDownloadProgress: progress,
  };

  const response = await axios.request(options);

  return response.status === 200 ? ((await response.data) as Song) : undefined;
};

export default download;
