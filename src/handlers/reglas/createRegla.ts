import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { created, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { parseCrearRegla, ValidationError } from '../../lib/validate';
import { categorizationService } from '../../services/categorizationService';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const body = event.body ? JSON.parse(event.body) : null;
    const input = parseCrearRegla(body);
    const regla = await categorizationService.crearRegla(userId, input);
    logger.info('regla creada', { id: regla.id, userId });
    return created(regla);
  } catch (err) {
    if (err instanceof ValidationError) return badRequest(err.message);
    if (err instanceof SyntaxError) return badRequest('JSON invalido');
    logger.error('error al crear regla', { error: String(err) });
    return serverError();
  }
};
