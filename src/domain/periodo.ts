/**
 * Devuelve el mes ANTERIOR a la fecha dada, en formato YYYY-MM.
 * Pensado para correr el dia 1: reporta el mes que acaba de cerrar.
 */
export const mesAnterior = (hoy: Date): string => {
  const anterior = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 1, 1));
  return anterior.toISOString().slice(0, 7);
};
