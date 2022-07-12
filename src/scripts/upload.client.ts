import {API_HOST, Song} from './api.client';

interface UploadResponse {
    id: string;
}

const upload = async ({
    trackName,
    artistName,
    description,
    image,
    audio,
    remainingPlays,
}: Song) => {
    const response = await fetch(`https://${API_HOST}/api/songs`, {
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

    return response.ok ? ((await response.json()) as UploadResponse) : undefined;
};

export default upload;
