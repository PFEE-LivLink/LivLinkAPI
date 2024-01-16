import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumber } from 'lib/utils/validators';

export const userType = {
  Dependent: 'Dependent',
  Helper: 'Helper',
} as const;

export type UserType = (typeof userType)[keyof typeof userType];

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index('user-phone', { unique: true })
  @IsPhoneNumber()
  phone: string;

  @Column()
  @IsEnum(userType)
  type: UserType;

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({ default: [] })
  dependentsFollowed: User[] = [];

  @Column({ default: [] })
  helperFollowers: User[] = [];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date;

  isDependent(): boolean {
    return this.type === userType.Dependent;
  }

  isHelper(): boolean {
    return this.type === userType.Helper;
  }

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
