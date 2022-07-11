import { API_HOST, Song } from './api.client';

const download = async (id: string) => {
  const response = await fetch(`http://${API_HOST}/api/songs/${id}`, {
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: origin,
    },
  });

  if (response.status === 200) {
    console.log('Successfully downloaded song');
    const song: Song = await response.json();
    console.log(`Song: ${song}`);
    return song;
  } else {
    console.log('Error downloading song');
    return undefined;
  }
};

export default download;
