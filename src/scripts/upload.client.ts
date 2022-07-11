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
    // TODO: File uploaded successfully, display success modal
    console.log('File uploaded successfully');
    const { id } = await response.json();
    console.log(`ID: ${id}`);
  } else {
    // TODO: File failed to upload, display failure modal
    console.log('File failed to upload');
  }
};

export default upload;
