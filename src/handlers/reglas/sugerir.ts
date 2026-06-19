import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ok, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { parseSugerir, ValidationError } from '../../lib/validate';
import {categorizationService} from "../../services/categorizationService";

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const body = event.body ? JSON.parse(event.body) : null;
    const { comercio, descripcion } = parseSugerir(body);
    const sug = await categorizationService.sugerir(userId, comercio, descripcion);
    return ok(sug ? { categoria: sug.categoria, reglaId: sug.reglaId } : { categoria: null });
  } catch (err) {
    if (err instanceof ValidationError) return badRequest(err.message);
    if (err instanceof SyntaxError) return badRequest('JSON invalido');
    logger.error('error al sugerir categoria', { error: String(err) });
    return serverError();
  }
};
