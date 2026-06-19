import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ok, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { categorizationService } from '../../services/categorizationService';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const reglas = await categorizationService.listarReglas(userId);
    return ok({ total: reglas.length, reglas });
  } catch (err) {
    logger.error('error al listar reglas', { error: String(err) });
    return serverError();
  }
};
