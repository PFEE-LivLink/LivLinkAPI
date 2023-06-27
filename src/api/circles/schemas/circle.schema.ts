/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';
import { CirclePerson, CirclePersonSchema } from './circle-person.schema';

export const circleType = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type CircleType = (typeof circleType)[keyof typeof circleType];

class CircleMethods {}

@Schema({ _id: false, versionKey: false })
export class Circle extends CircleMethods {
  constructor(type: CircleType) {
    super();
    this.type = type;
  }

  @Prop({ type: String, enum: Object.values(circleType), required: true })
  type: CircleType;

  @Prop({ type: [CirclePersonSchema], default: [] })
  persons: CirclePerson[];
}

export const CircleSchema = SchemaFactoryCustom.createForClass(Circle, CircleMethods);
