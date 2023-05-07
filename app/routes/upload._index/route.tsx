import type { MetaFunction } from '@remix-run/node';

import { startCase } from 'lodash';
import { useState } from 'react';
import { match } from 'ts-pattern';
import { useLoaderData } from '@remix-run/react';
import { Card } from '~/components/common/Card';
import { UploadForm } from '~/components';

import { loader } from './loader';
export { loader };

export const meta: MetaFunction = () => ({
  title: 'transient - Upload',
});

const Upload: React.FC = () => {
  const expirationRuleTypes = useLoaderData<typeof loader>();
  const [page, setPage] = useState<0 | 1 | 2>(0);

  const form = {
    expirationRuleTypes,
    setPage,
    page,
  };

  return (
    <article
      className={[
        'py-4',
        'flex',
        'justify-center',
        'gap-8',
        'flex-col',
        'md:flex-row',
        'items-center',
        'md:items-start',
        'md:px-40',
        'lg:px-60',
        'xl:px-80',
      ].join(' ')}
    >
      <div className='basis-1/3 w-3/4'>
        <h2 className='text-xl font-extrabold mb-3'>Upload your music now!</h2>
        {match(page)
          .with(0, _ => (
            <>
              <p className='text-sm'>
                Please upload your track files here. If you are uploading stems,
                you can select multiple audio files to upload as one track link.
              </p>
              <br />
              <p className='text-sm'>
                You can optionally select a cover art image to share with your
                track link as well.
              </p>
            </>
          ))
          .with(1, _ => (
            <p className='text-sm'>
              Please fill in your track information. You must specify a track
              name and artist, and you can optionally specify a description as
              well.
            </p>
          ))
          .with(2, _ => (
            <>
              <p className='text-sm'>
                Please select your expiration rules. The available rules are as
                follows:
              </p>
              <ul className='list-disc flex flex-col items-center justify-center'>
                {expirationRuleTypes.map(ruleType => (
                  <li key={ruleType.id}>
                    <b>{startCase(ruleType.name)}</b>
                  </li>
                ))}
              </ul>
            </>
          ))
          .exhaustive()}
      </div>

      <Card
        title='Upload'
        className='basis-2/3'
      >
        <UploadForm {...form} />
      </Card>
    </article>
  );
};

export default Upload;
