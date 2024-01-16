import { Column, Entity, ObjectId, ObjectIdColumn, BaseEntity, Index } from 'typeorm';
import { User } from 'lib/users/src/entities';
import { Call } from './call.entity';
import { IsArray, IsPhoneNumber, ValidateNested } from 'class-validator';

@Entity()
export class CallsHistory extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index('calls-history-phone', { unique: true })
  @IsPhoneNumber()
  phone: string;

  @Column(() => User)
  @IsArray()
  @ValidateNested()
  callsHistory: Call[];

  constructor(partial: Partial<CallsHistory>) {
    super();
    Object.assign(this, partial);
  }
}
