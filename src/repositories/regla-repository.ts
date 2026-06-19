import {
    DeleteCommand,
    PutCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { ddb } from '../lib/dynamo';
import { config } from '../config/env';
import { reglaKey, type ReglaItem } from '../domain/regla';

export class ReglaRepository {
    constructor(
        private readonly dynamo = ddb,
        private readonly tableName = config.tableName,
    ) {}

    async put(item: ReglaItem): Promise<void> {
        await this.dynamo.send(
            new PutCommand({
                TableName: this.tableName,
                Item: item,
            }),
        );
    }

    async listar(userId: string): Promise<ReglaItem[]> {
        const res = await this.dynamo.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression:
                    'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': `USER#${userId}`,
                    ':sk': 'REGLA#',
                },
            }),
        );

        return (res.Items as ReglaItem[]) ?? [];
    }

    async delete(
        userId: string,
        id: string,
    ): Promise<boolean> {
        const res = await this.dynamo.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: reglaKey(userId, id),
                ReturnValues: 'ALL_OLD',
            }),
        );

        return !!res.Attributes;
    }
}

export const reglaRepository = new ReglaRepository();