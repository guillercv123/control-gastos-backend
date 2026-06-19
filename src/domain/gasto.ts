import { ulid } from 'ulid';

export type MetodoPago = 'yape' | 'plin' | 'efectivo' | 'tarjeta' | 'otro';

export const METODOS_PAGO: MetodoPago[] = [
  'yape',
  'plin',
  'efectivo',
  'tarjeta',
  'otro',
];

// Umbral (en soles) para marcar un gasto como "hormiga".
export const UMBRAL_HORMIGA = 20;

// Lo que envia el cliente al crear un gasto.
export interface CrearGastoInput {
  monto: number;
  categoria: string;
  metodoPago: MetodoPago;
  fecha: string; // YYYY-MM-DD
  comercio?: string;
  descripcion?: string;
}

// El gasto tal como vive en el dominio / se devuelve por la API.
export interface Gasto {
  id: string;
  userId: string;
  monto: number;
  categoria: string;
  metodoPago: MetodoPago;
  fecha: string;
  comercio: string | null;
  descripcion: string | null;
  esHormiga: boolean;
  reciboKey: string | null;
  createdAt: string;
  updatedAt: string;
}

// El item tal como se guarda en DynamoDB (incluye las claves).
export interface GastoItem extends Gasto {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
}

// Clave primaria (particion + ordenamiento) de un gasto.
export const itemKey = (userId: string, id: string) => ({
  PK: `USER#${userId}`,
  SK: `GASTO#${id}`,
});

// Todas las claves, incluidas las del GSI1 (por mes).
export const buildKeys = (userId: string, id: string, fecha: string) => {
  const mes = fecha.slice(0, 7); // YYYY-MM
  return {
    ...itemKey(userId, id),
    GSI1PK: `USER#${userId}#${mes}`,
    GSI1SK: `${fecha}#${id}`,
  };
};

// Crea un GastoItem nuevo a partir del input del usuario.
export const nuevoGastoItem = (
  userId: string,
  input: CrearGastoInput,
): GastoItem => {
  const id = ulid(); // id unico y ordenable por tiempo
  const now = new Date().toISOString();
  return {
    ...buildKeys(userId, id, input.fecha),
    id,
    userId,
    monto: input.monto,
    categoria: input.categoria,
    metodoPago: input.metodoPago,
    fecha: input.fecha,
    comercio: input.comercio ?? null,
    descripcion: input.descripcion ?? null,
    esHormiga: input.monto < UMBRAL_HORMIGA,
    reciboKey: null,
    createdAt: now,
    updatedAt: now,
  };
};

// Devuelve un Gasto limpio (sin los atributos de clave de DynamoDB).
export const toGasto = (item: GastoItem): Gasto => ({
  id: item.id,
  userId: item.userId,
  monto: item.monto,
  categoria: item.categoria,
  metodoPago: item.metodoPago,
  fecha: item.fecha,
  comercio: item.comercio,
  descripcion: item.descripcion,
  esHormiga: item.esHormiga,
  reciboKey: item.reciboKey,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});
