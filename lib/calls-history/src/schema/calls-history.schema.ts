/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';
import { FrenchPhoneRegex } from 'src/constants';
import { Call, CallSchema } from './call.schema';

export type CallsHistoryDocument = CallsHistory & mongoose.Document;

class CallsHistoryMethods {}

@Schema()
export class CallsHistory extends CallsHistoryMethods {
  _id: string;

  @Prop({ type: String, unique: true, required: true, match: FrenchPhoneRegex })
  phone: string;

  @Prop({ type: [CallSchema], default: [] })
  callsHistory: Call[];
}

export const CallsHistorySchema = SchemaFactoryCustom.createForClass(CallsHistory, CallsHistoryMethods);
