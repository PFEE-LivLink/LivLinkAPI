/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => {
  return {
    get env(): string {
      if (process.env.NODE_ENV === undefined) {
        process.env.NODE_ENV = 'development';
      }
      return process.env.NODE_ENV;
    },
    protocol: process.env.APP_PROTOCOL ?? 'http',
    host: process.env.APP_HOST ?? 'localhost',
    port: Number(process.env.APP_PORT) || 3000,
    get domain(): string {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
