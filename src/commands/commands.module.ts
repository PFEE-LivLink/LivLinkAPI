import { Module } from '@nestjs/common';
import { RunCommand } from './run.command';

@Module({
  imports: [],
  providers: [RunCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
