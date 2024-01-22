import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class TestHelper {
  private static _instance: TestHelper;

  private constructor() {}

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  private memoryDB: MongoMemoryServer;
  private source: DataSource;

  getConfig(): DataSourceOptions {
    return {
      type: 'mongodb',
      url: this.memoryDB.getUri('test'),
      entities: ['lib/**/*.entity.ts'],
      synchronize: true,
    };
  }

  async startTestDB() {
    this.memoryDB = await MongoMemoryServer.create();
  }

  async stopTestDB() {
    await this.memoryDB.stop();
  }

  async setupTestDB() {
    await this.startTestDB();
    this.source = new DataSource(this.getConfig());
    await this.source.initialize();
  }

  async teardownTestDB() {
    await this.memoryDB.stop();
    await this.source.destroy();
  }

  async getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Promise<Repository<T>> {
    return this.source.getRepository(entity);
  }

  async dropCollections() {
    await this.source.dropDatabase();
  }
}
