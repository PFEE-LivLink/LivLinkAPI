import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/api/app.module';
import { TestHelper } from 'lib/utils/TestHelper';
import { FeatureConfigModule } from 'lib/config/feature-config/src';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    await TestHelper.instance.startTestDB();
  });

  afterAll(async () => {
    await TestHelper.instance.stopTestDB();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [FeatureConfigModule, AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const connection = moduleRef.get<DataSource>(DataSource);
    await connection.dropDatabase();
    if (connection.isInitialized) {
      await connection.destroy();
    }
  });

  it('e2e check 404', async () => {
    return await request(app.getHttpServer()).get('/unknown').expect(404);
  });

  // it('e2e check 200', async () => {
  //   AuthStrategy.as(new User({ phone: '+33600000000', firstName: 'John', lastName: 'Doe', type: 'Dependent' }));
  //   return await request(app.getHttpServer()).get('/users/me').expect(200);
  // });
});
