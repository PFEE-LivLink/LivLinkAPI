import { Injectable } from '@nestjs/common';
import EntityRepository from 'src/api/database/entity.repository';
import { CallsHistory, CallsHistoryDocument } from './schema/calls-history.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CallsHistoryRepository extends EntityRepository<CallsHistoryDocument> {
  constructor(@InjectModel(CallsHistory.name) model: Model<CallsHistoryDocument>) {
    super(model);
  }
}
