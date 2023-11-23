import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Call } from '../schema/call.schema';
import { IsFrenchPhoneNumber } from 'lib/utils/validators';

export class CallDto {
  static from(call: Call) {
    const dto = new CallDto();
    dto.caller = call.caller;
    dto.callee = call.callee;
    dto.startDate = call.startDate.toISOString();
    dto.endDate = call.endDate.toISOString();
    return dto;
  }

  @Expose()
  @ApiProperty({ example: '+33677777777' })
  @IsFrenchPhoneNumber()
  caller: string;

  @Expose()
  @ApiProperty({ example: '+33677777777' })
  @IsFrenchPhoneNumber()
  callee: string;

  @Expose()
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @Expose()
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDateString()
  endDate: string;
}
