import type { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * Fase 1: usuario fijo de prueba.
 * Fase 2 (Cognito): se reemplaza por el 'sub' del token, p. ej.:
 *   return event.requestContext.authorizer?.jwt?.claims?.sub as string;
 */
export const getUserId = (_event: APIGatewayProxyEventV2): string => 'demo';
