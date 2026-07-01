import type { SQSEvent, SQSRecord } from 'aws-lambda';
import { logger } from '../../lib/logger';
import { importacionService } from '../../services/importacion-service';

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      await procesarMensaje(record);
    } catch (err) {
      logger.error('error importando archivo desde la cola', { error: String(err) });
      throw err;
    }
  }
};

const procesarMensaje = async (record: SQSRecord): Promise<void> => {
  const evento = JSON.parse(record.body);
  for (const r of evento.Records ?? []) {
    const bucket = r.s3?.bucket?.name;
    const keyRaw = r.s3?.object?.key;
    if (!bucket || !keyRaw) continue;
    const key = decodeURIComponent(String(keyRaw).replace(/\+/g, ' '));
    await importacionService.procesarArchivo(bucket, key);
  }
};
