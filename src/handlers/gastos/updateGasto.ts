import type {APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {getUserId} from "../../lib/identity";
import {gastoService} from "../../services/gastoService";
import {badRequest, ok, serverError} from "../../lib/httpResponse";
import {logger} from "../../lib/logger";
import {parseActualizarGasto} from "../../lib/validate";

export const handler = async (
    event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
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
};