import { withMiddleware } from '../../lib/middleware';
import {resumenController} from "../../controller/resumen-controller";

export const handler = withMiddleware((event) => resumenController.obtenerResument(event));