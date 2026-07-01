import { withMiddleware } from '../../lib/middleware';
import {categorizacionController} from "../../controller/categorizacion-controller";

export const handler = withMiddleware((event) => categorizacionController.eliminarRegla(event));