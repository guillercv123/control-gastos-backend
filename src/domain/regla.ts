import { ulid } from 'ulid';

export interface CrearReglaInput {
  keyword: string;
  categoria: string;
}

export interface Regla {
  id: string;
  userId: string;
  keyword: string; // siempre en minusculas
  categoria: string;
  createdAt: string;
}

export interface ReglaItem extends Regla {
  PK: string;
  SK: string;
}

export const reglaKey = (userId: string, id: string) => ({
  PK: `USER#${userId}`,
  SK: `REGLA#${id}`,
});

export const nuevaReglaItem = (
  userId: string,
  input: CrearReglaInput,
): ReglaItem => {
  const id = ulid();
  return {
    ...reglaKey(userId, id),
    id,
    userId,
    keyword: input.keyword.trim().toLowerCase(),
    categoria: input.categoria.trim(),
    createdAt: new Date().toISOString(),
  };
};

export const toRegla = (item: ReglaItem): Regla => ({
  id: item.id,
  userId: item.userId,
  keyword: item.keyword,
  categoria: item.categoria,
  createdAt: item.createdAt,
});

/**
 * Motor de coincidencia: dado un texto (comercio + descripcion) y las reglas
 * del usuario, sugiere la categoria de la regla que mejor coincide.
 * Si varias coinciden, gana la de keyword mas larga (mas especifica).
 */
export const sugerirCategoria = (
  texto: string,
  reglas: Regla[],
): { categoria: string; reglaId: string } | null => {
  const t = texto.toLowerCase();
  const coincidencias = reglas
    .filter((r) => r.keyword !== '' && t.includes(r.keyword))
    .sort((a, b) => b.keyword.length - a.keyword.length);
  const mejor = coincidencias[0];
  return mejor ? { categoria: mejor.categoria, reglaId: mejor.id } : null;
};
