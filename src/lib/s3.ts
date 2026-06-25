import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

export const leerObjeto = async (bucket: string, key: string): Promise<string> => {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  // El SDK v3 expone transformToString() sobre el Body en Node.
  return (await res.Body!.transformToString()) ?? '';
};
