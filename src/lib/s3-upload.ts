import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env';

const s3 = new S3Client({});

/**
 * Genera una URL pre-firmada para SUBIR (PUT) un objeto a S3.
 * El front sube el archivo directo a S3 con esta URL: el backend no toca los bytes.
 * La URL hereda los permisos del rol de esta Lambda (solo PutObject en imports/*).
 */
export const generarUrlSubida = async (key: string, expiraEn = 300): Promise<string> => {
  const comando = new PutObjectCommand({ Bucket: config.importBucket, Key: key });
  return getSignedUrl(s3, comando, { expiresIn: expiraEn });
};
