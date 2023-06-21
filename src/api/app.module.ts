import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RunOptions } from 'src/constants';
import { MongoServerMemory } from './database/mongoServerMemory';
import { RunCommandOptions } from 'src/commands/run.command';

@Module({})
export class AppModule {
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
      imports: [MongooseModule.forRoot(mongoUri)],
      controllers: [],
      providers: [
        {
          provide: RunOptions,
          useValue: options ?? {},
        },
      ],
    };
  }
}
