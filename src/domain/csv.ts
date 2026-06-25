import { METODOS_PAGO, type CrearGastoInput, type MetodoPago } from './gasto';

// Tokeniza una linea CSV respetando comillas dobles y comas internas.
const parsearLinea = (linea: string): string[] => {
  const campos: string[] = [];
  let actual = '';
  let entreComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (entreComillas) {
      if (c === '"') {
        if (linea[i + 1] === '"') { actual += '"'; i++; } // comilla escapada ""
        else entreComillas = false;
      } else actual += c;
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === ',') {
      campos.push(actual); actual = '';
    } else {
      actual += c;
    }
  }
  campos.push(actual);
  return campos.map((s) => s.trim());
};

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ResultadoCsv {
  filas: CrearGastoInput[];
  errores: string[];
}

/**
 * Parsea un CSV con cabecera: fecha,descripcion,monto,metodoPago[,categoria]
 * Salta filas invalidas y las reporta. Logica pura (sin AWS).
 */
export const parsearCsvGastos = (texto: string): ResultadoCsv => {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim() !== '');
  const filas: CrearGastoInput[] = [];
  const errores: string[] = [];
  if (lineas.length === 0) return { filas, errores };

  const cabecera = parsearLinea(lineas[0]).map((h) => h.toLowerCase());
  const col = {
    fecha: cabecera.indexOf('fecha'),
    descripcion: cabecera.indexOf('descripcion'),
    monto: cabecera.indexOf('monto'),
    metodoPago: cabecera.indexOf('metodopago'),
    categoria: cabecera.indexOf('categoria'),
  };
  if (col.fecha < 0 || col.monto < 0) {
    errores.push('Cabecera invalida: se requieren al menos "fecha" y "monto"');
    return { filas, errores };
  }

  for (let i = 1; i < lineas.length; i++) {
    const celdas = parsearLinea(lineas[i]);
    const fecha = celdas[col.fecha] ?? '';
    const montoRaw = celdas[col.monto] ?? '';
    const monto = Number(montoRaw.replace(',', '.'));
    const descripcion = col.descripcion >= 0 ? (celdas[col.descripcion] ?? '') : '';
    const metodoRaw = (col.metodoPago >= 0 ? (celdas[col.metodoPago] ?? '') : '').toLowerCase();
    const categoria = (col.categoria >= 0 ? (celdas[col.categoria] ?? '') : '') || 'otros';

    if (!FECHA_RE.test(fecha)) { errores.push(`Fila ${i + 1}: fecha invalida ("${fecha}")`); continue; }
    if (!Number.isFinite(monto) || monto <= 0) { errores.push(`Fila ${i + 1}: monto invalido ("${montoRaw}")`); continue; }

    const metodoPago: MetodoPago = METODOS_PAGO.includes(metodoRaw as MetodoPago) ? (metodoRaw as MetodoPago) : 'otro';
    filas.push({
      fecha, monto, categoria, metodoPago,
      comercio: descripcion || undefined,
      descripcion: descripcion || undefined,
    });
  }
  return { filas, errores };
};

// Espera keys tipo "imports/<userId>/archivo.csv"
export const extraerUserIdDeKey = (key: string): string | null => {
  const partes = key.split('/');
  if (partes.length >= 3 && partes[0] === 'imports' && partes[1] !== '') return partes[1];
  return null;
};
