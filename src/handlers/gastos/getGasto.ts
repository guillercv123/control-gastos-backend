import { withMiddleware } from '../../lib/middleware';
import { gastosController } from '../../controller/gasto-controller';

export const handler = withMiddleware((event) => gastosController.findById(event));