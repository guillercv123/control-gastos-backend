
import {
  nuevaReglaItem,
  toRegla,
  sugerirCategoria,
  type CrearReglaInput,
  type Regla,
} from '../domain/regla';
import {reglaRepository} from "../repositories/reglaRepository";

export const categorizationService = {
  async crearRegla(userId: string, input: CrearReglaInput): Promise<Regla> {
    const item = nuevaReglaItem(userId, input);
    await reglaRepository.put(item);
    return toRegla(item);
  },

  async listarReglas(userId: string): Promise<Regla[]> {
    const items = await reglaRepository.listar(userId);
    return items.map(toRegla);
  },

  async eliminarRegla(userId: string, id: string): Promise<boolean> {
    return reglaRepository.delete(userId, id);
  },

  async sugerir(
    userId: string,
    comercio?: string,
    descripcion?: string,
  ): Promise<{ categoria: string; reglaId: string } | null> {
    const reglas = await this.listarReglas(userId);
    const texto = `${comercio ?? ''} ${descripcion ?? ''}`;
    return sugerirCategoria(texto, reglas);
  },
};
