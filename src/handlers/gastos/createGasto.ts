import { withMiddleware } from '../../lib/middleware';
import { gastosController } from '../../controller/gasto-controller';
import { crearGastoSchema } from '../../lib/schemas';

export const handler = withMiddleware(
  (event) => gastosController.crearGasto(event),
  crearGastoSchema,
);
