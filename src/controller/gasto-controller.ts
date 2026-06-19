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
import {
    parseActualizarGasto,
    parseCrearGasto,
    ValidationError,
} from '../lib/validate';
import {gastoService} from "../services/gasto-service";

export class GastoController {
    async crearGasto(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const body = event.body ? JSON.parse(event.body) : null;
            const input = parseCrearGasto(body);
            const gasto = await gastoService.crear(userId, input);
            logger.info('gasto creado', { id: gasto.id, userId });
            return created(gasto);
        } catch (err) {
            if (err instanceof ValidationError) return badRequest(err.message);
            if (err instanceof SyntaxError) return badRequest('JSON invalido');
            logger.error('error al crear gasto', { error: String(err) });
            return serverError();
        }
    }

    async eliminarGasto(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const id = event.pathParameters?.id;
            if (!id) return badRequest('Falta el id del gasto');
            const eliminado = await gastoService.eliminar(userId, id);
            return eliminado
                ? ok({ id, eliminado: true })
                : notFound('Gasto no encontrada');
        }catch (err) {
            logger.error('error al eliminar gasto', { error: String(err) });
            return serverError();
        }
    }

    async listarGastos(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2> {
        try {
            const userId = getUserId(event);
            const q = event.queryStringParameters ?? {};
            const gastos = await gastoService.listar(userId, {
                mes: q.mes,
                categoria: q.categoria,
                metodoPago: q.metodo,
            });
            return ok({ total: gastos.length, gastos });
        } catch (err) {
            logger.error('error al listar gastos', { error: String(err) });
            return serverError();
        }
    }

    async actualizarGasto(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2>{
        try {
            const userId = getUserId(event);
            const id = event.pathParameters?.id;
            if (!id) return badRequest('Falta el id del gasto');
            const data = parseActualizarGasto(JSON.parse(event.body ?? '{}'),);
            const gastoUpdated = await gastoService.actualizar(userId, id, data);
            return ok({ gastoUpdated });
        } catch (err) {
            logger.error('error al actualizar gasto', { error: String(err) });
            return serverError();
        }
    }

    async findById(
        event: APIGatewayProxyEventV2WithJWTAuthorizer,
    ): Promise<APIGatewayProxyStructuredResultV2>{
        try {
            const userId = getUserId(event);
            const id = event.pathParameters?.id;
            if (!id) return badRequest('Falta el id del gasto');
            const gasto = await gastoService.obtener(userId, id);
            return gasto ? ok(gasto) : notFound('Gasto no encontrado');
        } catch (err) {
            logger.error('error al obtener gasto', { error: String(err) });
            return serverError();
        }
    }
}

export const gastosController =
    new GastoController();