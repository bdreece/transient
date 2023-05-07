import type { LoaderArgs } from '@remix-run/node';
import type { Track } from 'generated/prisma';
import { json } from '@remix-run/node';

import { db } from '../../../server/services/db';
import { removeObject } from '@/services/s3';
import dayjs from 'dayjs';

const deleteTrack = async (track: Pick<Track, 'id'>) => {
  console.log('deleting track...');
  const files = await db.file.findMany({
    where: {
      OR: [{ trackAudioId: track.id }, { trackImageId: track.id }],
    },
    select: {
      id: true,
      key: true,
    },
  });

  await Promise.all(files.map(({ key }) => removeObject(key)));
  await db.track.delete({
    where: {
      id: track.id,
    },
  });
};

export const loader = async ({ params }: LoaderArgs) => {
  const id = params['id'];
  const track = await db.track.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      artist: true,
      audioFiles: {
        select: {
          id: true,
          filename: true,
          key: true,
        },
      },
      imageFile: {
        select: {
          key: true,
        },
      },
      expirationRules: {
        select: {
          id: true,
          intValue: true,
          dateValue: true,
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!track) {
    return json({ message: 'Track does not exist' });
  }

  const playBasedRule = track?.expirationRules.find(
    r => r.type.name === 'playBased',
  );

  if (playBasedRule) {
    console.dir(playBasedRule);

    if ((playBasedRule.intValue ?? 0) <= 0) {
      await deleteTrack(track);
      return json({ message: 'Play count has been exhausted' });
    }

    console.debug('decrementing plays');
    await db.expirationRule.update({
      where: {
        id: playBasedRule.id,
      },
      data: {
        intValue: (playBasedRule.intValue ?? 0) - 1,
      },
    });
  }

  const dateBasedRule = track?.expirationRules.find(
    r => r.type.name === 'dateBased',
  );

  if (dateBasedRule) {
    console.dir(dateBasedRule);
    if (
      dateBasedRule.dateValue &&
      dateBasedRule.dateValue < dayjs().utc().toDate()
    ) {
      deleteTrack(track);
      return json({ message: 'Track has expired' });
    }
  }

  return json(track);
};
