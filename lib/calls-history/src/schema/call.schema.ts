/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';
import { FrenchPhoneRegex } from 'src/constants';

class CallMethods {}

@Schema({ _id: false, versionKey: false })
export class Call extends CallMethods {
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }

  @Prop({ type: String, required: true, match: FrenchPhoneRegex })
  caller: string;

  @Prop({ type: String, required: true, match: FrenchPhoneRegex })
  callee: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;
}

export const CallSchema = SchemaFactoryCustom.createForClass(Call, CallMethods);
