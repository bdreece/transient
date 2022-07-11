import { API_HOST, Song } from './api.client';

const upload = async ({
  trackName,
  artistName,
  description,
  image,
  audio,
  remainingPlays,
}: Song) => {
  const response = await fetch(`http://${API_HOST}/api/songs`, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Method': 'POST',
      'Content-Type': 'application/json',
      Origin: origin,
    },
    body: JSON.stringify({
      trackName,
      artistName,
      description,
      image,
      audio,
      remainingPlays,
    }),
  });

  if (response.ok) {
    console.log('File uploaded successfully');
    const { id } = await response.json();
    return id;
  } else {
    console.log('File failed to upload');
    return undefined;
  }
};

export default upload;
