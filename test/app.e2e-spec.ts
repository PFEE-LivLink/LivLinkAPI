import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/api/app.module';
import { MongoServerMemory } from 'src/api/database/mongoServerMemory';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule.forModule({
          env: 'test',
          jwtSecret: 'jwtSecret',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await MongoServerMemory.registerConnection(app.get<Connection>(getConnectionToken()));
  });

  afterEach(async () => {
    await MongoServerMemory.stop();
  });

  it('e2e health check', async () => {
    return await request(app.getHttpServer()).get('/unknown').expect(404);
  });
});
