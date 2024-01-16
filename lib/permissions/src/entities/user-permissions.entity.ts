import { Column, Entity, ObjectId, ObjectIdColumn, BaseEntity, Index } from 'typeorm';
import { IsPhoneNumber } from 'lib/utils/validators';

@Entity()
export class UserPermission extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index('user-phone', { unique: true })
  @IsPhoneNumber()
  phone: string;

  @Column()
  circle1: Record<string, boolean>;

  @Column()
  circle2: Record<string, boolean>;

  @Column()
  circle3: Record<string, boolean>;

  constructor(partial: Partial<UserPermission>) {
    super();
    Object.assign(this, partial);
  }
}
