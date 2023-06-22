import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from './app.module';
import { MongoServerMemory } from './database/mongoServerMemory';

describe('AppModule', () => {
  const dbName = 'dbname';
  let originalEnv;

  beforeAll(() => {
    originalEnv = Object.assign({}, process.env);
  });

  afterAll(() => {
    process.env = Object.assign({}, originalEnv);
  });

  beforeEach(() => {
    process.env = Object.assign({}, {});
    process.env.MONGO_DB_NAME = dbName;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('on test env, should call MongoServerMemory', async () => {
    jest.spyOn(MongoServerMemory, 'create').mockResolvedValue(undefined);
    const spyUri = jest.spyOn(MongoServerMemory, 'getUri').mockReturnValue('uri');
    const spyMongooseModule = jest.spyOn(MongooseModule, 'forRoot').mockReturnValue({} as any);
    await AppModule.forModule({ env: 'test' });
    expect(spyUri).toHaveBeenCalled();
    expect(spyMongooseModule).toHaveBeenCalledWith('uri');
  });

  it('on dev env, with no env uri', async () => {
    const spyMongooseModule = jest.spyOn(MongooseModule, 'forRoot').mockReturnValue({} as any);
    await AppModule.forModule({ env: 'dev' });
    expect(spyMongooseModule).toHaveBeenCalledWith(`mongodb://root:12341234@localhost/${dbName}?authSource=admin`);
  });

  it('on dev env, with env uri', async () => {
    process.env.MONGO_DEV_URI = 'envUri';
    const spyMongooseModule = jest.spyOn(MongooseModule, 'forRoot').mockReturnValue({} as any);
    await AppModule.forModule({ env: 'dev' });
    expect(spyMongooseModule).toHaveBeenCalledWith(`envUri`);
  });

  it('on prod env, with env uri', async () => {
    process.env.MONGO_URI = 'prodUri';
    const spyMongooseModule = jest.spyOn(MongooseModule, 'forRoot').mockReturnValue({} as any);
    await AppModule.forModule({ env: 'prod' });
    expect(spyMongooseModule).toHaveBeenCalledWith(`prodUri`);
  });

  it('on unknown env, should throw', async () => {
    const spyMongooseModule = jest.spyOn(MongooseModule, 'forRoot').mockReturnValue({} as any);
    await expect(AppModule.forModule({ env: 'unknown' })).rejects.toThrowError();
    expect(spyMongooseModule).not.toHaveBeenCalled();
  });
});
