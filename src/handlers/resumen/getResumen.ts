import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ok, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { resumenService } from '../../services/resumenService';

const MES_RE = /^\d{4}-\d{2}$/;
const mesActual = (): string => new Date().toISOString().slice(0, 7);

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const mes = event.queryStringParameters?.mes ?? mesActual();
    if (!MES_RE.test(mes)) return badRequest('mes debe tener formato YYYY-MM');
    const resumen = await resumenService.generar(userId, mes);
    return ok(resumen);
  } catch (err) {
    logger.error('error al generar resumen', { error: String(err) });
    return serverError();
  }
};
