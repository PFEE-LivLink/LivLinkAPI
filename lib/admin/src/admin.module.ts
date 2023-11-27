import { Module } from '@nestjs/common';
import { UsersModule } from 'lib/users/src/users.module';
import { AdminController } from './admin.controller';
import { CallsHistoryModule } from 'lib/calls-history';

@Module({
  imports: [UsersModule, CallsHistoryModule],
  controllers: [AdminController],
})
export class AdminModule {}
