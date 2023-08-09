import type z from 'zod';
import type { ExpirationRuleInputProps } from './ExpirationRuleInput';
import type { ExpirationRuleType } from '../../../generated/prisma';

import { Link } from '@remix-run/react';
import { match } from 'ts-pattern';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconUpload } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';

import trpc from '~/hooks/trpc';
import debounce from '~/utils/debounce';
import { UploadSchema } from '~/schemas/upload';
import { useUploadMutation } from '~/hooks/upload';
import { ExpirationRuleInput } from './ExpirationRuleInput';
import { FileInput, FormControl, TextArea, TextInput } from '../common';

export type UploadFormProps = {
  page: 0 | 1 | 2;
  setPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
  expirationRuleTypes: ExpirationRuleType[];
};

export const UploadForm: React.FC<UploadFormProps> = ({
  expirationRuleTypes,
  page,
  setPage,
}) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audioFiles, setAudioFiles] = useState<FileList>();
  const [imageFile, setImageFile] = useState<File>();
  const nextPage = debounce(() => setPage((page + 1) as 1 | 2), 100);

  const { mutate, data } = useUploadMutation();
  const { mutate: createTrack, data: trackData } =
    trpc.createTrack.useMutation();

  const { control, register, getFieldState, handleSubmit, formState } = useForm<
    z.infer<typeof UploadSchema>
  >({
    resolver: zodResolver(UploadSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      rules: [],
    },
  });

  const activePageClass = (index: 0 | 1 | 2) =>
    page === index ? 'btn-active' : '';

  const canAdvancePage = (to: 1 | 2 | 'submit') =>
    match(to)
      .with(1, _ => uploading)
      .with(2, _ => formState.dirtyFields.name && formState.dirtyFields.artist)
      .with(
        'submit',
        _ =>
          (formState.dirtyFields.rules?.length ?? 0) > 0 && data && !submitting,
      )
      .exhaustive();

  const expirationRuleInput: ExpirationRuleInputProps = {
    control,
    register,
    expirationRuleTypes,
    error: getFieldState('rules').error?.message,
  };

  const onSubmit = handleSubmit(
    formData => {
      let imageFileId: string | undefined = undefined;
      setSubmitting(true);
      if (imageFile) {
        imageFileId = data?.find(v => v.filename == imageFile.name)?.id;
      }

      const audioFileIds =
        data?.filter(v => v.filename != imageFile?.name)?.map(v => v.id) ?? [];

      createTrack({
        ...formData,
        description: formData.description ?? null,
        audioFiles: audioFileIds,
        imageFile: imageFileId,
      });
    },
    err => console.error(err),
  );

  const uploadFiles = async () => {
    setUploading(true);
    mutate({ audioFiles: audioFiles ?? [], imageFile, setProgress });
  };

  return (
    <form onSubmit={onSubmit}>
      <article className='flex flex-col'>
        <section
          className={`w-full flex flex-col justify-center items-center ${
            page !== 0 ? 'hidden' : ''
          }`}
        >
          <FormControl
            withAsterisk
            label='Audio File(s)'
          >
            {id => (
              <FileInput
                id={id}
                multiple
                accept='audio/*'
                className='w-full'
                onChange={e => setAudioFiles(f => e.target.files ?? f)}
              />
            )}
          </FormControl>

          <FormControl label='Cover Art'>
            {id => (
              <FileInput
                id={id}
                accept='image/*'
                className='w-full'
                onChange={e =>
                  setImageFile(e.target.files?.item(0) ?? undefined)
                }
              />
            )}
          </FormControl>

          <button
            type='button'
            className='btn mt-4 w-full'
            disabled={uploading || (audioFiles?.length ?? 0) === 0}
            onClick={uploadFiles}
          >
            <IconUpload className='mr-2' />
            Upload
          </button>
        </section>

        <section
          className={`w-full flex flex-col ${page !== 1 ? 'hidden' : ''}`}
        >
          <FormControl
            withAsterisk
            label='Track Name'
            error={getFieldState('name').error?.message}
          >
            {id => (
              <TextInput
                id={id}
                {...register('name')}
              />
            )}
          </FormControl>

          <FormControl
            label='Track Description'
            error={getFieldState('description').error?.message}
          >
            {id => (
              <TextArea
                id={id}
                {...register('description')}
              />
            )}
          </FormControl>

          <FormControl
            withAsterisk
            label='Artist'
            error={getFieldState('artist').error?.message}
          >
            {id => (
              <TextInput
                id={id}
                {...register('artist')}
              />
            )}
          </FormControl>
        </section>

        <section
          className={`w-full flex flex-col ${page !== 2 ? 'hidden' : ''}`}
        >
          <ExpirationRuleInput {...expirationRuleInput} />
        </section>

        {trackData && (
          <>
            <div className='divider' />
            <label htmlFor='track-link'>
              Track created! Copy this URL to share it with friends!
            </label>
            <Link
              className='link link-success mt-2'
              to={`/track/${trackData.id}`}
            >
              {`${window.location.protocol}//${window.location.host}/track/${trackData.id}`}
            </Link>
          </>
        )}

        <div className='divider' />

        <progress
          className={`progress progress-primary mb-4 ${!uploading && 'hidden'}`}
          value={progress}
          max='100'
        ></progress>

        <section className='flex justify-between items-center'>
          <div className='btn-group'>
            <button
              type='button'
              className={`btn btn-xs ${activePageClass(0)}`}
              onClick={_ => setPage(0)}
            >
              1
            </button>
            <button
              type='button'
              className={`btn btn-xs ${activePageClass(1)}`}
              disabled={!canAdvancePage(1)}
              onClick={_ => setPage(1)}
            >
              2
            </button>
            <button
              type='button'
              className={`btn btn-xs ${activePageClass(2)}`}
              disabled={!canAdvancePage(2)}
              onClick={_ => setPage(2)}
            >
              3
            </button>
          </div>

          {page !== 2 ? (
            <button
              type='button'
              className='btn'
              disabled={!canAdvancePage((page + 1) as 1 | 2)}
              onClick={nextPage}
            >
              Next
            </button>
          ) : (
            <button
              type='submit'
              disabled={!canAdvancePage('submit')}
              className='btn btn-primary'
            >
              Submit
            </button>
          )}
        </section>
      </article>
    </form>
  );
};
