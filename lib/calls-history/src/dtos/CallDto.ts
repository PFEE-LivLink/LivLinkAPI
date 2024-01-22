import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Call, CallStatus, callStatus } from '../entities';
import { IsPhoneNumber } from 'lib/utils/validators';

export class CallDto {
  static from(call: Call) {
    const dto = new CallDto();
    dto.caller = call.caller;
    dto.callee = call.callee;
    dto.startDate = call.startDate.toISOString();
    dto.endDate = call.endDate?.toISOString();
    dto.status = call.status;
    return dto;
  }

  @Expose()
  @ApiProperty({ example: '+33677777777' })
  @IsPhoneNumber()
  caller: string;

  @Expose()
  @ApiProperty({ example: '+33677777777' })
  @IsPhoneNumber()
  callee: string;

  @Expose()
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @Expose()
  @ApiProperty({ required: false, example: '2021-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Expose()
  @ApiProperty({ enum: callStatus, example: callStatus.Success })
  @IsEnum(callStatus)
  status: CallStatus;
}
