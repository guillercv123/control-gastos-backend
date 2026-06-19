import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { ok, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { gastoService } from '../../services/gastoService';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const q = event.queryStringParameters ?? {};
    const gastos = await gastoService.listar(userId, {
      mes: q.mes,
      categoria: q.categoria,
      metodoPago: q.metodo,
    });
    return ok({ total: gastos.length, gastos });
  } catch (err) {
    logger.error('error al listar gastos', { error: String(err) });
    return serverError();
  }
};
