import { Module } from '@nestjs/common';
import { RunCommand } from './run.command';
import { DocCommand } from './doc.command';
import { FeatureConfigModule } from 'lib/config/feature-config/src';

@Module({
  imports: [FeatureConfigModule],
  providers: [RunCommand, DocCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
