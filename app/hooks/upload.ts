import _ from 'lodash';
import trpc from './trpc';

import { useMutation } from '@tanstack/react-query';

export const useUploadMutation = () => {
  const {
    mutateAsync: uploadMutate,
    data: uploadData,
    error: uploadError,
  } = trpc.upload.useMutation();

  return useMutation({
    mutationFn: async ({
      audioFiles,
      imageFile,
      setProgress,
    }: {
      audioFiles: FileList | File[];
      imageFile?: File | undefined;
      setProgress: React.Dispatch<React.SetStateAction<number>>;
    }) => {
      const scale = 100 / (audioFiles.length + (imageFile ? 2 : 1));

      let audioFileInputs: File[] = [];
      for (const file of audioFiles ?? []) {
        audioFileInputs.push(file);
      }

      // create File rows in DB and create presigned upload urls
      const files = await uploadMutate({
        audioFiles: audioFileInputs.map(({ name, type }) => ({ name, type })),
        imageFile: imageFile
          ? {
              name: imageFile.name,
              type: imageFile.type,
            }
          : undefined,
      });

      setProgress(p => p + scale);

      await Promise.all(
        files.reduce<Promise<Response>[]>((p, f) => {
          let file: File | undefined = undefined;
          if (f.filename === imageFile?.name) {
            // current url is for image file
            file = imageFile;
          }

          if (!file) {
            file = audioFileInputs.find(v => v.name == f.filename);
          }

          if (file) {
            const promise = fetch(f.url, {
              method: 'PUT',
              headers: {
                'Content-Type': file.type,
                'Content-Length': file.size.toString(),
              },
              body: file,
            }).then(res => {
              setProgress(p => p + scale);
              return res;
            });
            // append upload promise for this file
            return [...p, promise];
          }

          return p;
        }, []),
      );

      return files;
    },
  });
};
