import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { ok, notFound, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { gastoService } from '../../services/gastoService';

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const id = event.pathParameters?.id;
    if (!id) return badRequest('Falta el id del gasto');
    const gasto = await gastoService.obtener(userId, id);
    return gasto ? ok(gasto) : notFound('Gasto no encontrado');
  } catch (err) {
    logger.error('error al obtener gasto', { error: String(err) });
    return serverError();
  }
};
