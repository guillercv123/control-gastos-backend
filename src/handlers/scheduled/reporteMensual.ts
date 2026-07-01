import type { ScheduledEvent } from 'aws-lambda';
import { logger } from '../../lib/logger';
import { mesAnterior } from '../../domain/periodo';
import { reporteMensualService } from '../../services/reporte-mensual-service';
import { withErrorLogging } from '../../lib/middleware';

export const handler = withErrorLogging(
  async (event: ScheduledEvent & { mes?: string }) => {
    const mes = event?.mes ?? mesAnterior(new Date());
    logger.info('iniciando reporte mensual', { mes });
    await reporteMensualService.generarYEnviar(mes);
  },
);
