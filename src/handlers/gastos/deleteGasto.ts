import type {
    APIGatewayProxyEventV2WithJWTAuthorizer,
    APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

import {getUserId} from "../../lib/identity";
import {badRequest, notFound, ok, serverError} from "../../lib/httpResponse";
import {logger} from "../../lib/logger";
import {gastoService} from "../../services/gastoService";

export const handler = async (
    event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        const userId = getUserId(event);
        const id = event.pathParameters?.id;
        if (!id) return badRequest('Falta el id del gasto');
        const res = await gastoService.eliminar(userId, id);
        return res ? ok(res) : notFound('Gasto no se pudo eliminar');
    }catch (err) {
        logger.error('error al eliminar gasto', { error: String(err) });
        return serverError();
    }
}