import type { ScheduledEvent } from 'aws-lambda';
import { logger } from '../../lib/logger';
import { mesAnterior } from '../../domain/periodo';
import { reporteMensualService } from '../../services/reporte-mensual-service';

export const handler = async (
  event: ScheduledEvent & { mes?: string },
): Promise<void> => {
  const mes = event?.mes ?? mesAnterior(new Date());
  logger.info('iniciando reporte mensual', { mes });
  await reporteMensualService.generarYEnviar(mes);
};

