/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const mongoConfiguration = registerAs('mongo', () => {
  return {
    dbName: process.env.MONGO_DB_NAME ?? 'liv-link-api',
    get uri(): string {
      return process.env.MONGO_URI ?? `mongodb://root:12341234@localhost/${this.dbName}?authSource=admin`;
    },
  };
});

export type MongoConfiguration = ConfigType<typeof mongoConfiguration>;

export const InjectMongoConfig = () => Inject(mongoConfiguration.KEY);
