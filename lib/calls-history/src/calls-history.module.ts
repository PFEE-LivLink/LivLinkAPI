import { Module } from '@nestjs/common';
import { CallsHistoryController } from './calls-history.controller';
import { CallsHistoryService } from './calls-history.service';
import { CallsHistoryRepository } from './calls-history.repository';
import { CallsHistory, CallsHistorySchema } from './schema/calls-history.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'lib/users/src/users.module';
import { CallsHistoryFilter } from './calls-history.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [MongooseModule.forFeature([{ name: CallsHistory.name, schema: CallsHistorySchema }]), UsersModule],
  controllers: [CallsHistoryController],
  providers: [
    CallsHistoryService,
    CallsHistoryRepository,
    {
      provide: APP_FILTER,
      useClass: CallsHistoryFilter,
    },
  ],
})
export class CallsHistoryModule {}
