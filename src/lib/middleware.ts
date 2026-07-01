import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { logger } from './logger';
import { ValidationError } from './validate';

type Handler = (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
) => Promise<APIGatewayProxyStructuredResultV2>;

const json = (statusCode: number, body: unknown): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const errorHandler = (): middy.MiddlewareObj<
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


export const withMiddleware = (handler: Handler) =>
  middy(handler)
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(errorHandler());
