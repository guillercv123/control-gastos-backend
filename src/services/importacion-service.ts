import { leerObjeto } from '../lib/s3';
import { parsearCsvGastos, extraerUserIdDeKey } from '../domain/csv';
import { nuevoGastoItem, type GastoItem } from '../domain/gasto';
import { gastoRepository } from '../repositories/gasto-repository';
import { logger } from '../lib/logger';

export class ImportacionService {
  async procesarArchivo(bucket: string, key: string): Promise<void> {
    const userId = extraerUserIdDeKey(key);
    if (!userId) {
      logger.warn('archivo ignorado: la key no tiene formato imports/<userId>/...', { key });
      return;
    }

    const texto = await leerObjeto(bucket, key);
    const { filas, errores } = parsearCsvGastos(texto);
    if (errores.length > 0) logger.warn('filas con error en el CSV', { key, errores });
    if (filas.length === 0) { logger.info('CSV sin filas validas', { key }); return; }

    const items: GastoItem[] = filas.map((f) => nuevoGastoItem(userId, f));
    await gastoRepository.putLote(items);
    logger.info('importacion completada', { key, userId, insertados: items.length, conError: errores.length });
  }
}

export const importacionService = new ImportacionService();
