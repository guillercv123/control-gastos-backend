import type { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { logger } from '../../lib/logger';
import { alertaHormigaService } from '../../services/alerta-service';
import type { Gasto } from '../../domain/gasto';

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      if (!esGastoNuevo(record)) continue;
      // NewImage viene en formato DynamoDB (S/N/BOOL...); unmarshall lo pasa a objeto JS.
      // El cast evita el choque de tipos entre aws-lambda y el SDK (misma forma en runtime).
      const gasto = unmarshall(record.dynamodb!.NewImage as any) as Gasto;
      await alertaHormigaService.evaluarGasto(gasto);
    } catch (err) {
      // No relanzamos: un registro con problema no debe frenar el resto del lote.
      logger.error('error procesando registro del stream', { error: String(err) });
    }
  }
};

// Nos quedamos solo con INSERTs de gastos (no reglas, no updates).
const esGastoNuevo = (record: DynamoDBRecord): boolean => {
  if (record.eventName !== 'INSERT') return false;
  const sk = record.dynamodb?.Keys?.SK?.S;
  return typeof sk === 'string' && sk.startsWith('GASTO#');
};
