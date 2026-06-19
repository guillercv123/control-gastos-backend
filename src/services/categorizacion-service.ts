import {reglaRepository, ReglaRepository} from '../repositories/regla-repository';
import {CrearReglaInput, nuevaReglaItem, Regla, sugerirCategoria, toRegla} from "../domain/regla";

export class CategorizacionService {
  constructor(
      private readonly reglaRepository: ReglaRepository,
  ) {}

  async crearRegla(
      userId: string,
      input: CrearReglaInput,
  ): Promise<Regla> {
    const item = nuevaReglaItem(userId, input);

    await this.reglaRepository.put(item);

    return toRegla(item);
  }

  async listarReglas(
      userId: string,
  ): Promise<Regla[]> {
    const items = await this.reglaRepository.listar(userId);

    return items.map(toRegla);
  }

  async eliminarRegla(
      userId: string,
      id: string,
  ): Promise<boolean> {
    return this.reglaRepository.delete(userId, id);
  }

  async sugerir(
      userId: string,
      comercio?: string,
      descripcion?: string,
  ): Promise<{ categoria: string; reglaId: string } | null> {
    const reglas = await this.listarReglas(userId);

    return sugerirCategoria(
        `${comercio ?? ''} ${descripcion ?? ''}`,
        reglas,
    );
  }
}

export const categorizationService =
    new CategorizacionService(reglaRepository);