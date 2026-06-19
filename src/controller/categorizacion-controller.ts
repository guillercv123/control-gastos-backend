import type {
    APIGatewayProxyEventV2WithJWTAuthorizer,
    APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

import {
    ok,
    created,
    badRequest,
    notFound,
    serverError,
} from '../lib/httpResponse';

import { logger } from '../lib/logger';
import { getUserId } from '../lib/identity';
import { categorizationService } from '../services/categorizacion-service';
import {
    parseCrearRegla, parseSugerir,
    ValidationError,
} from '../lib/validate';

export class CategorizacionController {
    async crearRegla(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const body = event.body ? JSON.parse(event.body) : null;

            const input = parseCrearRegla(body);

            const regla = await categorizationService.crearRegla(
                userId,
                input,
            );

            return created(regla);
        } catch (err) {
            if (err instanceof ValidationError) {
                return badRequest(err.message);
            }

            if (err instanceof SyntaxError) {
                return badRequest('JSON invalido');
            }

            logger.error('error al crear regla', {
                error: String(err),
            });

            return serverError();
        }
    }

    async eliminarRegla(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const id = event.pathParameters?.id;

            if (!id) {
                return badRequest('Falta el id de la regla');
            }

            const eliminado =
                await categorizationService.eliminarRegla(
                    userId,
                    id,
                );

            return eliminado
                ? ok({ id, eliminado: true })
                : notFound('Regla no encontrada');
        } catch (err) {
            logger.error('error al eliminar regla', {
                error: String(err),
            });

            return serverError();
        }
    }

    async listaReglas(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const reglas = await categorizationService.listarReglas(userId);
            return ok({ total: reglas.length, reglas });
        } catch (err) {
            logger.error('error al listar reglas', { error: String(err) });
            return serverError();
        }
    }

    async sugerir(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2>{
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
    }
}

export const categorizacionController =
    new CategorizacionController();