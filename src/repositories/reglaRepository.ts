import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo';
import { config } from '../config/env';
import { reglaKey, type ReglaItem } from '../domain/regla';

const TABLE = config.tableName;

export const reglaRepository = {
  async put(item: ReglaItem): Promise<void> {
    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
  },

  async listar(userId: string): Promise<ReglaItem[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: { ':pk': `USER#${userId}`, ':sk': 'REGLA#' },
      }),
    );
    return (res.Items as ReglaItem[]) ?? [];
  },

  async delete(userId: string, id: string): Promise<boolean> {
    const res = await ddb.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: reglaKey(userId, id),
        ReturnValues: 'ALL_OLD',
      }),
    );
    return !!res.Attributes;
  },
};
