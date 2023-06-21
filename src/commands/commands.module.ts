import { Module } from '@nestjs/common';
import { RunCommand } from './run.command';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RunCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
