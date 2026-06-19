import type { Gasto } from './gasto';

export interface Resumen {
  periodo: string;            // YYYY-MM
  cantidad: number;           // total de gastos
  cantidadHormiga: number;    // cuantos fueron hormiga
  totalGastado: number;
  totalHormiga: number;
  porcentajeHormiga: number;  // % del gasto que fue hormiga
  proyeccionAnualHormiga: number; // si sigues asi todo el ano
  porCategoria: Record<string, number>;
  porMetodoPago: Record<string, number>;
}

const redondear = (n: number, dec = 2): number => Math.round(n * 10 ** dec) / 10 ** dec;

const agruparSumando = (
  gastos: Gasto[],
  campo: 'categoria' | 'metodoPago',
): Record<string, number> => {
  const acc: Record<string, number> = {};
  for (const g of gastos) {
    const clave = g[campo];
    acc[clave] = redondear((acc[clave] ?? 0) + g.monto);
  }
  return acc;
};

/**
 * Calcula el resumen de un periodo a partir de los gastos.
 * Logica pura (sin AWS): facil de testear.
 */
export const calcularResumen = (periodo: string, gastos: Gasto[]): Resumen => {
  const totalGastado = redondear(gastos.reduce((s, g) => s + g.monto, 0));
  const hormigas = gastos.filter((g) => g.esHormiga);
  const totalHormiga = redondear(hormigas.reduce((s, g) => s + g.monto, 0));
  const porcentajeHormiga =
    totalGastado > 0 ? redondear((totalHormiga / totalGastado) * 100, 1) : 0;

  return {
    periodo,
    cantidad: gastos.length,
    cantidadHormiga: hormigas.length,
    totalGastado,
    totalHormiga,
    porcentajeHormiga,
    proyeccionAnualHormiga: redondear(totalHormiga * 12),
    porCategoria: agruparSumando(gastos, 'categoria'),
    porMetodoPago: agruparSumando(gastos, 'metodoPago'),
  };
};
