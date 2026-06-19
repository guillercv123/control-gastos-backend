import {
  gastoRepository,
  type ListarFiltros,
} from '../repositories/gastoRepository';
import {
  nuevoGastoItem,
  toGasto,
  type CrearGastoInput,
  type Gasto
} from '../domain/gasto';

export const gastoService = {
  async crear(userId: string, input: CrearGastoInput): Promise<Gasto> {
    const item = nuevoGastoItem(userId, input);
    await gastoRepository.put(item);
    return toGasto(item);
  },

  async obtener(userId: string, id: string): Promise<Gasto | null> {
    const item = await gastoRepository.get(userId, id);
    return item ? toGasto(item) : null;
  },

  async listar(userId: string, filtros: ListarFiltros): Promise<Gasto[]> {
    const items = await gastoRepository.listar(userId, filtros);
    return items.map(toGasto);
  },

  async eliminar(
      userId:string,
      id: string
  ): Promise<boolean>{
    return await gastoRepository.delete(userId, id);
  },

  async actualizar(
      userId: string,
      id: string,
      data: Partial<Gasto>,
  ): Promise<Gasto | null> {
    const item = await gastoRepository.update(userId, id, data);
    return item ? toGasto(item) : null;
  },

};
