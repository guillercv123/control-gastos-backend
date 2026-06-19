import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

/**
 * Devuelve el userId real: el 'sub' (identificador unico) del token de Cognito,
 * que API Gateway ya valido antes de invocar esta Lambda.
 */
export const getUserId = (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): string => {
  const sub = event.requestContext.authorizer?.jwt?.claims?.sub;
  if (typeof sub !== 'string' || sub === '') {
    throw new Error('No se encontro el usuario (sub) en el token');
  }
  return sub;
};
