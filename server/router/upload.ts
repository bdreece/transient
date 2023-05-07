import type { Track } from '../../generated/prisma';

import z from 'zod';
import mime from 'mime-types';
import { uuid } from 'uuidv4';

import { db } from '../services/db';
import { createPresignedUrl } from '../services/s3';
import { router, procedure } from './trpc';
import { ExpirationRuleModel, TrackModel } from '../../generated/zod';

const fileSchema = z.object({
  type: z.string(),
  name: z.string(),
});

const uploadSchema = z.object({
  audioFiles: z.array(fileSchema),
  imageFile: fileSchema.optional(),
});

const trackSchema = TrackModel.pick({
  name: true,
  description: true,
  artist: true,
}).merge(
  z.object({
    audioFiles: z.array(z.string()),
    imageFile: z.string().optional(),
    rules: z.array(
      ExpirationRuleModel.omit({
        id: true,
        trackId: true,
      }).merge(
        z.object({
          dateValue: z.preprocess(d => {
            if (!d || typeof d !== 'string') {
              return undefined;
            }

            return new Date(d);
          }, z.date().optional()),
        }),
      ),
    ),
  }),
);

export default router({
  upload: procedure.input(uploadSchema).mutation(async ({ input }) => {
    let files = await Promise.all(
      input.audioFiles.map(f => createUploadInput(f)),
    );

    if (input.imageFile) {
      const imageFile = await createUploadInput(input.imageFile);
      files.push(imageFile);
    }

    return await Promise.all(
      files.map(async f => {
        const file = await db.file.create({
          data: { filename: f.filename, key: f.key },
        });
        return {
          ...file,
          url: f.url,
        };
      }),
    );
  }),

  createTrack: procedure.input(trackSchema).mutation(({ input }) => {
    const { name, description, artist, audioFiles, imageFile, rules } = input;
    const imageConnection = imageFile
      ? {
          imageFile: {
            connect: {
              id: imageFile,
            },
          },
        }
      : undefined;
    return db.track.create({
      select: { id: true },
      data: {
        name,
        description,
        artist,
        audioFiles: {
          connect: audioFiles.map(id => ({ id })),
        },
        expirationRules: {
          createMany: {
            data: rules,
          },
        },
        ...imageConnection,
      },
    });
  }),
});

const createUploadInput = async (f: z.infer<typeof fileSchema>) => {
  const key = `${uuid()}.${mime.extension(f.type)}`;
  const url = await createPresignedUrl(key, f.type);
  return {
    filename: f.name,
    key,
    url,
  };
};
