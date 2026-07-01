import type { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { logger } from '../../lib/logger';
import { alertaHormigaService } from '../../services/alerta-service';
import type { Gasto } from '../../domain/gasto';

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      if (!esGastoNuevo(record)) continue;
      const gasto = unmarshall(record.dynamodb!.NewImage as any) as Gasto;
      await alertaHormigaService.evaluarGasto(gasto);
    } catch (err) {
      logger.error('error procesando registro del stream', { error: String(err) });
    }
  }
};


const esGastoNuevo = (record: DynamoDBRecord): boolean => {
  if (record.eventName !== 'INSERT') return false;
  const sk = record.dynamodb?.Keys?.SK?.S;
  return typeof sk === 'string' && sk.startsWith('GASTO#');
};
