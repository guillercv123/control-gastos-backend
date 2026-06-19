import {
  METODOS_PAGO,
  type CrearGastoInput,
  type MetodoPago, ActualizarGastoInput,
} from '../domain/gasto';

export class ValidationError extends Error {}

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

// Valida y normaliza el cuerpo recibido para crear un gasto.
export const parseCrearGasto = (body: unknown): CrearGastoInput => {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('El cuerpo debe ser un objeto JSON');
  }
  const b = body as Record<string, unknown>;

  if (typeof b.monto !== 'number' || !Number.isFinite(b.monto) || b.monto <= 0) {
    throw new ValidationError('monto debe ser un numero mayor que 0');
  }
  if (typeof b.categoria !== 'string' || b.categoria.trim() === '') {
    throw new ValidationError('categoria es obligatoria');
  }
  if (
    typeof b.metodoPago !== 'string' ||
    !METODOS_PAGO.includes(b.metodoPago as MetodoPago)
  ) {
    throw new ValidationError(
      `metodoPago debe ser uno de: ${METODOS_PAGO.join(', ')}`,
    );
  }
  if (typeof b.fecha !== 'string' || !FECHA_RE.test(b.fecha)) {
    throw new ValidationError('fecha debe tener formato YYYY-MM-DD');
  }
  if (b.comercio !== undefined && typeof b.comercio !== 'string') {
    throw new ValidationError('comercio debe ser texto');
  }
  if (b.descripcion !== undefined && typeof b.descripcion !== 'string') {
    throw new ValidationError('descripcion debe ser texto');
  }

  return {
    monto: b.monto,
    categoria: b.categoria.trim(),
    metodoPago: b.metodoPago as MetodoPago,
    fecha: b.fecha,
    comercio: b.comercio as string | undefined,
    descripcion: b.descripcion as string | undefined,
  };
};

export const parseActualizarGasto = (
    body: unknown,
): ActualizarGastoInput => {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('El cuerpo debe ser un objeto JSON');
  }

  const b = body as Record<string, unknown>;

  const result: ActualizarGastoInput = {};

  if (b.monto !== undefined) {
    if (
        typeof b.monto !== 'number' ||
        !Number.isFinite(b.monto) ||
        b.monto <= 0
    ) {
      throw new ValidationError('monto debe ser un numero mayor que 0');
    }

    result.monto = b.monto;
  }

  if (b.categoria !== undefined) {
    if (
        typeof b.categoria !== 'string' ||
        b.categoria.trim() === ''
    ) {
      throw new ValidationError('categoria debe ser texto');
    }

    result.categoria = b.categoria.trim();
  }

  if (b.metodoPago !== undefined) {
    if (
        typeof b.metodoPago !== 'string' ||
        !METODOS_PAGO.includes(b.metodoPago as MetodoPago)
    ) {
      throw new ValidationError(
          `metodoPago debe ser uno de: ${METODOS_PAGO.join(', ')}`,
      );
    }

    result.metodoPago = b.metodoPago as MetodoPago;
  }

  if (b.fecha !== undefined) {
    if (
        typeof b.fecha !== 'string' ||
        !FECHA_RE.test(b.fecha)
    ) {
      throw new ValidationError(
          'fecha debe tener formato YYYY-MM-DD',
      );
    }

    result.fecha = b.fecha;
  }

  if (b.comercio !== undefined) {
    if (b.comercio !== null && typeof b.comercio !== 'string') {
      throw new ValidationError('comercio debe ser texto o null');
    }

    result.comercio = b.comercio as string | null;
  }

  if (b.descripcion !== undefined) {
    if (
        b.descripcion !== null &&
        typeof b.descripcion !== 'string'
    ) {
      throw new ValidationError('descripcion debe ser texto o null');
    }

    result.descripcion = b.descripcion as string | null;
  }

  return result;
};
