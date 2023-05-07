import cron from 'node-cron';
import { db } from './db';
import { removeObject } from './s3';

export const scheduleCleanup = () =>
  cron.schedule('0 0 4 * * *', () => {
    console.time('cleanup');
    cleanup()
      .then(() => console.timeEnd('cleanup'))
      .catch(e => console.error(e));
  });

const timeLog = (...data: any[]) => console.timeLog('cleanup', data);
const cleanup = async () => {
  const files = await db.file.findMany({
    where: {
      trackAudioId: null,
      trackImageId: null,
    },
    select: {
      id: true,
      key: true,
    },
  });
  timeLog('collected trackless files');

  await Promise.all(files.map(({ key }) => removeObject(key)));
  timeLog('deleted file blobs...');

  await db.file.deleteMany({
    where: {
      id: {
        in: files.map(f => f.id),
      },
    },
  });
  timeLog('deleted files...');
};
