/**
 * Arma la key de S3 para una importacion del usuario.
 * Forma: imports/<userId>/<timestamp>-<nombreLimpio>.csv
 * - El backend extrae el userId del 2do segmento (imports/<userId>/...).
 * - El prefijo timestamp evita colisiones / sobre-escrituras.
 * - Se sanitiza el nombre (sin rutas ni caracteres raros) para no romper la key.
 */
export const construirKeyImport = (userId: string, filename: string): string => {
  const base = filename.split(/[\\/]/).pop() ?? 'archivo.csv';
  const limpio = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `imports/${userId}/${Date.now()}-${limpio}`;
};
