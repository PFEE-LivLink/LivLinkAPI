/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';
import { User } from 'src/api/user/schemas/user.schema';
import { Circle, CircleSchema, CircleType, circleType } from './circle.schema';

export type UserCirclesDocument = UserCircles & mongoose.Document;

class UserCirclesMethods {
  static compareCirclesType(a: CircleType, b: CircleType): number {
    const types = Object.values(circleType);
    return types.indexOf(a) - types.indexOf(b);
  }
}

@Schema()
export class UserCircles extends UserCirclesMethods {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
  user: User;

  @Prop({
    type: {
      [circleType.High]: { type: CircleSchema },
      [circleType.Medium]: { type: CircleSchema },
      [circleType.Low]: { type: CircleSchema },
    },
    required: true,
    default: {
      [circleType.High]: new Circle(circleType.High),
      [circleType.Medium]: new Circle(circleType.Medium),
      [circleType.Low]: new Circle(circleType.Low),
    },
  })
  circles: Record<CircleType, Circle>;
}

export const UserCirclesSchema = SchemaFactoryCustom.createForClass(UserCircles, UserCirclesMethods);
