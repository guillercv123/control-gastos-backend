import { gastoRepository } from '../repositories/gasto-repository';
import { toGasto } from '../domain/gasto';
import {
  calcularResumen,
  type Resumen,
} from '../domain/resumen';

export class ResumenService {
  async generar(
      userId: string,
      mes: string,
  ): Promise<Resumen> {
    const items = await gastoRepository.listar(userId, {
      mes,
    });

    const gastos = items.map(toGasto);

    return calcularResumen(mes, gastos);
  }
}

export const resumenService = new ResumenService();