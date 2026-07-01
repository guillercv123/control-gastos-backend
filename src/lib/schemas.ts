import { METODOS_PAGO } from '../domain/gasto';


export const crearGastoSchema = {
  type: 'object',
  properties: {
    monto: { type: 'number', exclusiveMinimum: 0 },
    categoria: { type: 'string', minLength: 1 },
    metodoPago: { type: 'string', enum: [...METODOS_PAGO] },
    fecha: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    comercio: { type: 'string' },
    descripcion: { type: 'string' },
  },
  required: ['monto', 'categoria', 'metodoPago', 'fecha'],
  additionalProperties: false,
};


export const crearReglaSchema = {
  type: 'object',
  properties: {
    keyword: { type: 'string', minLength: 1 },
    categoria: { type: 'string', minLength: 1 },
  },
  required: ['keyword', 'categoria'],
  additionalProperties: false,
};
