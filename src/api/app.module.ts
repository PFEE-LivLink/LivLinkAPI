import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationInterceptor } from './validation.interceptor';
import * as path from 'path';
import {
  AppConfiguration,
  MongoConfiguration,
  appConfiguration,
  mongoConfiguration,
} from 'lib/config/utils-config/src';
import { TestHelper } from 'lib/utils/TestHelper';
import { UsersModule } from 'lib/users';
import { AuthModule } from 'lib/authentification/auth.module';
import { FeatureConfigModule } from 'lib/config/feature-config/src';
import { CallsHistoryModule } from 'lib/calls-history';
import { PermissionsModule } from 'lib/permissions';

@Module({
  imports: [
    FeatureConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [mongoConfiguration.KEY, appConfiguration.KEY],
      useFactory: async (config: MongoConfiguration, appConfig: AppConfiguration) => {
        if (appConfig.env === 'test') {
          return TestHelper.instance.getConfig();
        }
        return {
          type: 'mongodb',
          url: config.uri,
          entities: [path.join(__dirname, '/**/*.entity.{ts,js}')],
          synchronize: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          logging: true,
        };
      },
    }),
    PermissionsModule,
    AuthModule,
    UsersModule,
    CallsHistoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class AppModule {}
