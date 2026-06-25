import type { SQSEvent, SQSRecord } from 'aws-lambda';
import { logger } from '../../lib/logger';
import { importacionService } from '../../services/importacion-service';

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      await procesarMensaje(record);
    } catch (err) {
      // Relanzamos: SQS reintenta y, tras varios intentos, manda el mensaje a la DLQ.
      logger.error('error importando archivo desde la cola', { error: String(err) });
      throw err;
    }
  }
};

const procesarMensaje = async (record: SQSRecord): Promise<void> => {
  const evento = JSON.parse(record.body);
  // El cuerpo es la notificacion de S3: { Records: [ { s3: { bucket, object } } ] }
  for (const r of evento.Records ?? []) {
    const bucket = r.s3?.bucket?.name;
    const keyRaw = r.s3?.object?.key;
    if (!bucket || !keyRaw) continue;
    // S3 codifica la key en el evento (espacios y caracteres especiales).
    const key = decodeURIComponent(String(keyRaw).replace(/\+/g, ' '));
    await importacionService.procesarArchivo(bucket, key);
  }
};
