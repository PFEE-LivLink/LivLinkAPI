/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/api/database/custom.schema.factory';

export type UserDocument = User & mongoose.Document;

export const userType = {
  Dependent: 'Dependent',
  Helper: 'Helper',
} as const;

export type UserType = (typeof userType)[keyof typeof userType];

class UserMethods {
  isDependent(this: User): boolean {
    return this.type === userType.Dependent;
  }

  isHelper(this: User): boolean {
    return this.type === userType.Helper;
  }
}

@Schema()
export class User extends UserMethods {
  _id: string;

  @Prop({ type: String, required: true, unique: true, match: /^(\+33 )[1-9]( \d\d){4}$/ })
  phone: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, enum: Object.values(userType) })
  type: UserType;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;
}

export const UserSchema = SchemaFactoryCustom.createForClass(User, UserMethods);
