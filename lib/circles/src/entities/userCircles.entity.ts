/* eslint-disable @typescript-eslint/no-extraneous-class */
import { IsArray, ValidateNested } from 'class-validator';
import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm';
import { CirclePerson } from './circlePerson.entity';
import { IsPhoneNumber } from 'lib/utils/validators';

@Entity()
export class UserCircles {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsPhoneNumber()
  @Index('user-circles-phone', { unique: true })
  phone: string;

  @Column()
  @IsArray()
  @ValidateNested()
  persons: CirclePerson[];

  constructor(data?: Partial<UserCircles>) {
    Object.assign(this, data);
  }
}
