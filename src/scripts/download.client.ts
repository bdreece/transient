import { API_HOST, Song } from './api.client';

const download = async (id: string) => {
  const response = await fetch(`http://${API_HOST}/api/songs/${id}`, {
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: origin,
    },
  });

  return response.status === 200
    ? ((await response.json()) as Song)
    : undefined;
};

export default download;
