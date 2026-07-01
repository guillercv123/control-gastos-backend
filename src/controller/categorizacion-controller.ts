import type {
    APIGatewayProxyEventV2WithJWTAuthorizer,
    APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

import {
    ok,
    created,
    badRequest,
    notFound,
} from '../lib/httpResponse';
import { getUserId } from '../lib/identity';
import { categorizationService } from '../services/categorizacion-service';
import {
    parseCrearRegla, parseSugerir,
} from '../lib/validate';

export class CategorizacionController {
    async crearRegla(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
            const userId = getUserId(event);
            const body = event.body;
            const input = parseCrearRegla(body);
            const regla = await categorizationService.crearRegla(
                userId,
                input,
            );
            return created(regla);
    }

    async eliminarRegla(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
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
    }

    async listaReglas(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
            const userId = getUserId(event);
            const reglas = await categorizationService.listarReglas(userId);
            return ok({ total: reglas.length, reglas });
    }

    async sugerir(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2>{
            const userId = getUserId(event);
            const body = event.body ? event.body : null;
            const { comercio, descripcion } = parseSugerir(body);
            const sug = await categorizationService.sugerir(userId, comercio, descripcion);
            return ok(sug ? { categoria: sug.categoria, reglaId: sug.reglaId } : { categoria: null });
    }
}

export const categorizacionController =
    new CategorizacionController();