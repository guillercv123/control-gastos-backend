import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { logger } from './logger';
import { ValidationError } from './validate';

type HttpHandler = (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
) => Promise<APIGatewayProxyStructuredResultV2>;

const json = (statusCode: number, body: unknown): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// ---- Middleware de errores para HTTP: convierte excepciones en respuestas HTTP ----
const httpErrorHandler = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2
> => ({
  onError: (request) => {
    const err = request.error as (Error & { statusCode?: number }) | null;
    if (!err) return;
    if (err instanceof ValidationError) {
      request.response = json(400, { error: err.message });
      return;
    }
    if (err instanceof SyntaxError || err.statusCode === 415 || err.statusCode === 422) {
      request.response = json(400, { error: 'El cuerpo debe ser JSON valido' });
      return;
    }
    if (typeof err.statusCode === 'number') {
      request.response = json(err.statusCode, { error: err.message });
      return;
    }
    logger.error('error no controlado', { error: err.message, stack: err.stack });
    request.response = json(500, { error: 'Error interno' });
  },
});

/** Para handlers HTTP: parsea el body y centraliza el manejo de errores (excepciones -> respuesta HTTP). */
export const withMiddleware = (handler: HttpHandler) =>
  middy(handler)
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(httpErrorHandler());

/**
 * Para handlers EVENT-DRIVEN (SQS, schedule): registra cualquier error no controlado
 * y lo RELANZA, para que Lambda reintente / el mensaje caiga al DLQ. No devuelve HTTP.
 */
export const withErrorLogging = <TEvent, TResult>(
  handler: (event: TEvent) => Promise<TResult>,
) =>
  middy<TEvent, TResult>(handler).use({
    onError: (request) => {
      logger.error('error no controlado en handler', {
        error: (request.error as Error)?.message,
        stack: (request.error as Error)?.stack,
      });
      // No seteamos request.response: dejamos propagar el error (retry / DLQ).
    },
  });
