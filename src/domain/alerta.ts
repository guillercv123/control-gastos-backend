/**
 * Decide si un nuevo gasto hormiga hizo CRUZAR el umbral mensual.
 * Devuelve true SOLO en el momento del cruce (para no alertar en cada gasto posterior).
 *
 *   antes = total del mes - el gasto que acaba de entrar
 *   cruza si: antes < umbral  Y  total ya >= umbral
 */
export const cruzaUmbral = (
  totalHormigaDespues: number,
  montoGasto: number,
  umbral: number,
): boolean => {
  const antes = totalHormigaDespues - montoGasto;
  return antes < umbral && totalHormigaDespues >= umbral;
};
