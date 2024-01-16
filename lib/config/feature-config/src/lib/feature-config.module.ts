import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, mongoConfiguration } from 'lib/config/utils-config/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, mongoConfiguration],
    }),
  ],
})
export class FeatureConfigModule {}
