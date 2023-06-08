/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/database/custom.schema.factory';

export type UserDocument = User & mongoose.Document;

enum UserType {
  Helper = 'helper',
  Dependent = 'dependent',
}

class UserMethods {
  isDependent(this: User): boolean {
    return this.type === UserType.Dependent;
  }

  isHelper(this: User): boolean {
    return this.type === UserType.Helper;
  }
}

@Schema()
export class User extends UserMethods {
  _id: string;

  @Prop({ type: String, required: true, unique: true, match: /^(\+33 )[1-9](\d\d){4}$/ })
  phone: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop()
  type: UserType;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;
}

export const UserSchema = SchemaFactoryCustom.createForClass(User, UserMethods);
