import { gastoRepository } from '../repositories/gastoRepository';
import { toGasto } from '../domain/gasto';
import { calcularResumen, type Resumen } from '../domain/resumen';

export const resumenService = {
  async generar(userId: string, mes: string): Promise<Resumen> {
    const items = await gastoRepository.listar(userId, { mes });
    const gastos = items.map(toGasto);
    return calcularResumen(mes, gastos);
  },
};
