import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection } from 'mongoose';

let mongodMemory: MongoMemoryServer;
let mongoConnectionMemory: Connection;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MongoServerMemory {
  public static async create(): Promise<void> {
    mongodMemory = await MongoMemoryServer.create();
  }

  public static getUri(): string {
    return mongodMemory.getUri();
  }

  public static async start(): Promise<void> {
    await this.create();
    const uri = this.getUri();
    mongoConnectionMemory = (await connect(uri)).connection;
  }

  public static async registerConnection(connection: Connection): Promise<void> {
    mongoConnectionMemory = connection;
  }

  public static async stop(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (mongodMemory) {
      await mongoConnectionMemory.dropDatabase();
      await mongoConnectionMemory.close();
      await mongodMemory.stop();
    }
  }

  public static getMongoConnection(): Connection {
    return mongoConnectionMemory;
  }
}
