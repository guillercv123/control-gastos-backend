import { gastoRepository } from '../repositories/gasto-repository';
import { toGasto, type Gasto } from '../domain/gasto';
import { componerReporteMensual } from '../domain/reporte';
import { publicarMensaje } from '../lib/sns';
import { logger } from '../lib/logger';

export class ReporteMensualService {
  async generarYEnviar(mes: string): Promise<void> {
    const items = await gastoRepository.escanearGastos();

    // Agrupar los gastos del mes objetivo por usuario.
    const porUsuario = new Map<string, Gasto[]>();
    for (const item of items) {
      const g = toGasto(item);
      if (g.fecha.slice(0, 7) !== mes) continue;
      const lista = porUsuario.get(g.userId) ?? [];
      lista.push(g);
      porUsuario.set(g.userId, lista);
    }

    if (porUsuario.size === 0) {
      logger.info('reporte mensual: sin gastos en el periodo', { mes });
      return;
    }

    const mensaje = componerReporteMensual(mes, porUsuario);
    await publicarMensaje(`Resumen mensual de gastos hormiga (${mes})`, mensaje);
    logger.info('reporte mensual enviado', { mes, usuarios: porUsuario.size });
  }
}

export const reporteMensualService = new ReporteMensualService();
