import {
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo';
import { config } from '../config/env';
import { itemKey, type GastoItem } from '../domain/gasto';

const TABLE = config.tableName;

export interface ListarFiltros {
  mes?: string;
  categoria?: string;
  metodoPago?: string;
}

export const gastoRepository = {
  async put(item: GastoItem): Promise<void> {
    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
  },

  async get(userId: string, id: string): Promise<GastoItem | null> {
    const res = await ddb.send(
      new GetCommand({ TableName: TABLE, Key: itemKey(userId, id) }),
    );
    return (res.Item as GastoItem) ?? null;
  },

  async listar(
    userId: string,
    filtros: ListarFiltros = {},
  ): Promise<GastoItem[]> {
    if (filtros.mes) {
      const res = await ddb.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :pk',
          ExpressionAttributeValues: {
            ':pk': `USER#${userId}#${filtros.mes}`,
          },
          ScanIndexForward: false,
        }),
      );
      return applyFilters((res.Items as GastoItem[]) ?? [], filtros);
    }

    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk': 'GASTO#',
        },
        ScanIndexForward: false,
      }),
    );
    return applyFilters((res.Items as GastoItem[]) ?? [], filtros);
  },
};

const applyFilters = (
  items: GastoItem[],
  filtros: ListarFiltros,
): GastoItem[] =>
  items.filter(
    (g) =>
      (!filtros.categoria || g.categoria === filtros.categoria) &&
      (!filtros.metodoPago || g.metodoPago === filtros.metodoPago),
  );
