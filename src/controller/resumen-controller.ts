import type {
    APIGatewayProxyEventV2WithJWTAuthorizer,
    APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

import {
    ok,
    badRequest
} from '../lib/httpResponse';

import { getUserId } from '../lib/identity';

const MES_RE = /^\d{4}-\d{2}$/;
const mesActual = (): string => new Date().toISOString().slice(0, 7);

import {resumenService} from "../services/resumen-service";

export class ResumenController {

    async obtenerResument(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
            const userId = getUserId(event);
            const mes = event.queryStringParameters?.mes ?? mesActual();
            if (!MES_RE.test(mes)) return badRequest('mes debe tener formato YYYY-MM');
            const resumen = await resumenService.generar(userId, mes);
            return ok(resumen);
    }
}

export const resumenController =
    new ResumenController();