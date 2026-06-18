import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { ok } from '../../lib/httpResponse';
import { config } from '../../config/env';
import { logger } from '../../lib/logger';

/**
 * GET /health
 * Verifica la espina dorsal: API Gateway -> Lambda -> respuesta.
 */
export const handler = async (
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('health check invocado');
  return ok({
    status: 'ok',
    service: config.serviceName,
    stage: config.stage,
    time: new Date().toISOString(),
  });
};
