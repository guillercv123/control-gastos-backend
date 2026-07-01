import type { SQSEvent, SQSRecord } from 'aws-lambda';
import { importacionService } from '../../services/importacion-service';
import { withErrorLogging } from '../../lib/middleware';

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

export const handler = withErrorLogging(async (event: SQSEvent) => {
  for (const record of event.Records) {
    await procesarMensaje(record);
  }
});
