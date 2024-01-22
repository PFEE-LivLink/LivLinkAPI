import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CircleType, circleType } from '../../entities/circlePerson.entity';

export class SendCircleRequestRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  phone: string;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  type: CircleType;
}
