/* eslint-disable @typescript-eslint/no-extraneous-class */
import { IsEnum, IsString } from 'class-validator';
import { IsPhoneNumber } from 'lib/utils/validators';
import { Column } from 'typeorm';

export const circlePersonStatus = {
  Pending: 'Pending',
  Accepted: 'Accepted',
} as const;
export type CirclePersonStatus = (typeof circlePersonStatus)[keyof typeof circlePersonStatus];

export const circleType = {
  Near: 'Near',
  Mid: 'Mid',
  Distant: 'Distant',
} as const;
export type CircleType = (typeof circleType)[keyof typeof circleType];

export class CirclePerson {
  @Column()
  @IsString()
  id: string;

  @Column()
  @IsPhoneNumber()
  phone: string;

  @Column()
  @IsEnum(circleType)
  type: CircleType;

  @Column()
  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;

  constructor(data?: Partial<CirclePerson>) {
    Object.assign(this, data);
  }
}
