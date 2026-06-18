import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const baseHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export function response(
  statusCode: number,
  body: unknown,
): APIGatewayProxyStructuredResultV2 {
  return { statusCode, headers: baseHeaders, body: JSON.stringify(body) };
}

export const ok = (body: unknown) => response(200, body);
export const created = (body: unknown) => response(201, body);
export const badRequest = (message: string) => response(400, { error: message });
export const notFound = (message = 'No encontrado') =>
  response(404, { error: message });
export const serverError = (message = 'Error interno') =>
  response(500, { error: message });
