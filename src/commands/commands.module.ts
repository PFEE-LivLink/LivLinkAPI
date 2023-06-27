import { Module } from '@nestjs/common';
import { RunCommand } from './run.command';
import { ConfigModule } from '@nestjs/config';
import { DocCommand } from './doc.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RunCommand, DocCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
