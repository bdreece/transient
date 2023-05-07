import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const region = 'us-east-2';
const bucket = 'transient-bucket';
const client = new S3Client({ region });

export const createPresignedUrl = async (
  key: string,
  contentType?: string | undefined,
) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn: 900 });
};

export const removeObject = (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return client.send(command);
};
