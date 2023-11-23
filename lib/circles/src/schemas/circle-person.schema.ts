/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';
import { FrenchPhoneRegex } from 'src/constants';

export const circlePersonStatus = {
  Pending: 'pending',
  Accepted: 'accepted',
  Rejected: 'rejected',
} as const;
export type CirclePersonStatus = (typeof circlePersonStatus)[keyof typeof circlePersonStatus];

class CirclePersonMethods {
  setToAccept(this: CirclePerson): CirclePerson {
    this.status = circlePersonStatus.Accepted;
    return this;
  }

  setToReject(this: CirclePerson): CirclePerson {
    this.status = circlePersonStatus.Rejected;
    return this;
  }

  isAccepted(this: CirclePerson): boolean {
    return this.status === circlePersonStatus.Accepted;
  }

  isRejected(this: CirclePerson): boolean {
    return this.status === circlePersonStatus.Rejected;
  }

  isPending(this: CirclePerson): boolean {
    return this.status === circlePersonStatus.Pending;
  }
}

@Schema({ _id: false, versionKey: false })
export class CirclePerson extends CirclePersonMethods {
  constructor(phone: string, status: CirclePersonStatus) {
    super();
    this.phone = phone;
    this.status = status;
  }

  @Prop({ type: String, required: true, match: FrenchPhoneRegex })
  phone: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(circlePersonStatus),
    default: circlePersonStatus.Pending,
  })
  status: CirclePersonStatus;
}

export const CirclePersonSchema = SchemaFactoryCustom.createForClass(CirclePerson, CirclePersonMethods);
