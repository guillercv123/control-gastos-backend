import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { created, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { parseCrearGasto, ValidationError } from '../../lib/validate';
import { gastoService } from '../../services/gastoService';

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const body = event.body ? JSON.parse(event.body) : null;
    const input = parseCrearGasto(body);
    const gasto = await gastoService.crear(userId, input);
    logger.info('gasto creado', { id: gasto.id, userId });
    return created(gasto);
  } catch (err) {
    if (err instanceof ValidationError) return badRequest(err.message);
    if (err instanceof SyntaxError) return badRequest('JSON invalido');
    logger.error('error al crear gasto', { error: String(err) });
    return serverError();
  }
};
