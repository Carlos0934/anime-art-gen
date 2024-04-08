import {
  DynamoDB,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { KVStore } from "./interface";

export class DynamoDBKvStore<T extends Record<string, unknown>>
  implements KVStore<T>
{
  private readonly client: DynamoDBClient;

  constructor(private readonly tableName: string) {
    this.client = new DynamoDBClient({});
  }

  async get(key: string): Promise<T | null> {
    const params = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        key: { S: key },
      },
    });

    const { Item } = await this.client.send(params);

    const values = Item?.value?.S;

    if (!values) return null;

    return JSON.parse(values) as T;
  }

  async set(key: string, value: T): Promise<void> {
    const params = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        key: { S: key },
        value: { S: JSON.stringify(value) },
      },
    });

    await this.client.send(params);
  }

  async delete(key: string): Promise<void> {
    const params = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        key: { S: key },
      },
    });

    await this.client.send(params);
  }
}
