import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { RunOptions } from 'src/constants';
import { MongoServerMemory } from './database/mongoServerMemory';
import { RunCommandOptions } from 'src/commands/run.command';
import { AuthModule } from './authentification/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationInterceptor } from './validation.interceptor';
import { CircleModule } from './circles/circle.module';
import { HttpExceptionFilter } from './http-errors.filter';
import { Connection } from 'mongoose';

@Module({})
export class AppModule implements OnModuleDestroy {
  public static async forModule(options: Partial<RunCommandOptions>): Promise<DynamicModule> {
    const dbName = process.env.MONGO_DB_NAME ?? 'liv-link-api';
    let mongoUri = '';
    if (options.env === 'test') {
      await MongoServerMemory.create();
      mongoUri = MongoServerMemory.getUri();
    } else if (options.env === 'dev') {
      mongoUri = process.env.MONGO_DEV_URI ?? `mongodb://root:12341234@localhost/${dbName}?authSource=admin`;
    } else if (options.env === 'prod') {
      mongoUri = process.env.MONGO_URI ?? '';
    } else {
      throw new Error(`Unknown environment: ${options.env ?? 'undefined'}`);
    }

    return {
      global: true,
      module: AppModule,
      imports: [MongooseModule.forRoot(mongoUri), AuthModule, CircleModule],
      controllers: [],
      providers: [
        {
          provide: RunOptions,
          useValue: options ?? {},
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ValidationInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
      exports: [RunOptions],
    };
  }

  constructor(@Inject(getConnectionToken()) private readonly connection: Connection) {}

  async onModuleDestroy(): Promise<void> {
    await MongoServerMemory.registerConnection(this.connection);
    await MongoServerMemory.stop(); // will be trigger only if the memory database is used
  }
}
