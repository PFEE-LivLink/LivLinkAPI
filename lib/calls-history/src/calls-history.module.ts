import { Module } from '@nestjs/common';
import { CallsHistoryController } from './calls-history.controller';
import { CallsHistoryService } from './calls-history.service';
import { UsersModule } from 'lib/users/src/users.module';
import { CallsHistoryFilter } from './calls-history.filter';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call, CallsHistory } from './entities';
import { PermissionsModule } from 'lib/permissions';
import { CirclesModule } from 'lib/circles';

@Module({
  imports: [TypeOrmModule.forFeature([Call, CallsHistory]), UsersModule, PermissionsModule, CirclesModule],
  controllers: [CallsHistoryController],
  providers: [
    CallsHistoryService,
    {
      provide: APP_FILTER,
      useClass: CallsHistoryFilter,
    },
  ],
  exports: [CallsHistoryService],
})
export class CallsHistoryModule {}
