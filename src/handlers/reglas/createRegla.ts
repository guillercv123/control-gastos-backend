import { withMiddleware } from '../../lib/middleware';
import { categorizacionController } from '../../controller/categorizacion-controller';
import { crearReglaSchema } from '../../lib/schemas';

export const handler = withMiddleware(
  (event) => categorizacionController.crearRegla(event),
  crearReglaSchema,
);
