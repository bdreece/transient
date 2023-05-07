import type { MetaFunction } from '@remix-run/node';

import _ from 'lodash';
import { IconPhotoX } from '@tabler/icons-react';
import { useLoaderData } from '@remix-run/react';
import { Card } from '~/components/common/Card';
import { loader } from './loader';
import React from 'react';
import dayjs from 'dayjs';

export { loader };
export const meta: MetaFunction = () => ({
  title: 'transient - Track',
});

const Track: React.FC = () => {
  const track = useLoaderData<typeof loader>();
  return !('message' in track) ? (
    <>
      <br />
      <Card className='w-3/4 lg:w-1/2 mx-auto'>
        <div className='flex flex-col items-center justify-center'>
          <h2 className='text-xl'>{track.name}</h2>
          <div
            className={[
              'flex',
              'justify-center',
              'items-center',
              'my-4',
              'gap-8',
              'flex-col',
              'sm:flex-row',
              'mx-auto',
              'sm:mx-0',
            ].join(' ')}
          >
            {track.imageFile ? (
              <img
                src={`https://transient-bucket.s3.us-east-2.amazonaws.com/${track.imageFile?.key}`}
                alt={track.imageFile?.key}
                width='256'
              />
            ) : (
              <IconPhotoX
                size={128}
                style={{ marginTop: '-0.5rem' }}
              />
            )}
            <div>
              {track.description && (
                <>
                  <b>Description:</b>
                  <p>{track.description}</p>
                  <br />
                </>
              )}

              <b>Artist:</b>
              <p>{track.artist}</p>

              <div className='divider' />

              {track.expirationRules.map(rule => (
                <React.Fragment key={rule.id}>
                  {rule.type.name === 'playBased' ? (
                    <>
                      <b>Plays Remaining</b>
                      <p>{rule.intValue! - 1}</p>
                    </>
                  ) : (
                    <>
                      <b>Expiration Date</b>
                      <p>{dayjs(rule.dateValue!).format('LLL')}</p>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          {track.audioFiles.map(f => (
            <React.Fragment key={f.id}>
              <label
                className='my-2 overflow-hidden text-ellipsis'
                htmlFor={f.id}
              >
                {f.filename}
              </label>
              <audio
                controls
                id={f.id}
                className='mb-4'
                src={`https://transient-bucket.s3.us-east-2.amazonaws.com/${f.key}`}
              ></audio>
            </React.Fragment>
          ))}
        </div>
      </Card>
      <br />
    </>
  ) : (
    <>
      <br />
      <Card
        title='Track not found!'
        className='w-3/4 lg:w-1/2 mx-auto'
      >
        <p>{track.message}</p>
      </Card>
      <br />
    </>
  );
};

export default Track;
