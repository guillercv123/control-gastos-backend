import type { Gasto } from './gasto';
import { calcularResumen } from './resumen';

/**
 * Arma el texto del reporte mensual a partir de los gastos agrupados por usuario.
 * Logica pura: facil de testear.
 */
export const componerReporteMensual = (
  mes: string,
  gastosPorUsuario: Map<string, Gasto[]>,
): string => {
  const lineas: string[] = [`Resumen de gastos hormiga - ${mes}`, ''];
  for (const [userId, gastos] of gastosPorUsuario) {
    const r = calcularResumen(mes, gastos);
    lineas.push(
      `Usuario ${userId}`,
      `  Total gastado:    S/ ${r.totalGastado.toFixed(2)}`,
      `  Gastos hormiga:   S/ ${r.totalHormiga.toFixed(2)} (${r.porcentajeHormiga}% del total)`,
      `  Proyeccion anual: S/ ${r.proyeccionAnualHormiga.toFixed(2)}`,
      '',
    );
  }
  return lineas.join('\n');
};
