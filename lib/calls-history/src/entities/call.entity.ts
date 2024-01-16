import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { IsDifferentThan } from 'lib/utils/validators/IsDifferentThan';
import { IsLaterThan } from 'lib/utils/validators/IsLaterThan.validator';
import { Column } from 'typeorm';

export const callStatus = {
  Success: 'Success',
  Failed: 'Failed',
} as const;
export type CallStatus = (typeof callStatus)[keyof typeof callStatus];

export class Call {
  @Column()
  @IsPhoneNumber()
  caller: string;

  @Column()
  @IsPhoneNumber()
  @IsDifferentThan('caller')
  callee: string;

  @Column()
  @IsDate()
  startDate: Date;

  @Column()
  @IsOptional()
  @IsDate()
  @IsLaterThan('startDate')
  endDate?: Date;

  @Column()
  @IsEnum(callStatus)
  status: CallStatus;

  constructor(data: Partial<Call>) {
    Object.assign(this, data);
  }
}
