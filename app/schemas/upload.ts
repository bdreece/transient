import z from 'zod';
import {
  TrackModel,
  ExpirationRuleModel,
  FileModel,
} from '../../generated/zod';

export const UploadRuleSchema = ExpirationRuleModel.omit({
  id: true,
  policyId: true,
}).merge(
  z.object({
    dateValue: z.preprocess(d => {
      if (!d || typeof d !== 'string') {
        return undefined;
      }

      return new Date(d);
    }, ExpirationRuleModel.shape.dateValue),
    intValue: z.preprocess(s => {
      if (!s || typeof s !== 'string') {
        return undefined;
      }

      const n = parseInt(s);
      if (isNaN(n)) {
        return undefined;
      }

      return n;
    }, ExpirationRuleModel.shape.intValue),
  }),
);

export const UploadFileSchema = FileModel.pick({
  id: true,
});

export const UploadSchema = TrackModel.omit({
  id: true,
  imageFileId: true,
}).merge(
  z.object({
    name: TrackModel.shape.name.min(1, 'Name must not be empty!'),
    artist: TrackModel.shape.artist.min(1, 'Artist name must not be empty!'),
    rules: z.array(UploadRuleSchema),
  }),
);
