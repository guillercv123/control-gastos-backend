import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ok, badRequest, serverError } from '../../lib/httpResponse';
import { logger } from '../../lib/logger';
import { getUserId } from '../../lib/identity';
import { generarUrlSubida } from '../../lib/s3-upload';
import { construirKeyImport } from '../../lib/import-key';

const EXPIRA_SEG = 300; // 5 minutos

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const userId = getUserId(event);
    const filename = (event.queryStringParameters?.filename ?? '').trim();
    if (!filename) return badRequest('Falta el parametro filename');
    if (!/\.csv$/i.test(filename)) return badRequest('El archivo debe terminar en .csv');

    const key = construirKeyImport(userId, filename);
    const uploadUrl = await generarUrlSubida(key, EXPIRA_SEG);

    logger.info('url de subida generada', { userId, key });
    return ok({ uploadUrl, key, expiraEn: EXPIRA_SEG });
  } catch (err) {
    logger.error('error generando url de subida', { error: String(err) });
    return serverError();
  }
};
