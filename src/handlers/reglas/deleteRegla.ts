import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ok, badRequest, notFound, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { categorizationService } from '../../services/categorizationService';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const id = event.pathParameters?.id;
    if (!id) return badRequest('Falta el id de la regla');
    const eliminado = await categorizationService.eliminarRegla(userId, id);
    return eliminado ? ok({ id, eliminado: true }) : notFound('Regla no encontrada');
  } catch (err) {
    logger.error('error al eliminar regla', { error: String(err) });
    return serverError();
  }
};
