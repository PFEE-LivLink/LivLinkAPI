import { TransformFrenchPhoneNumber } from 'lib/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'lib/utils/validators';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SendCircleRequestRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  @IsFrenchPhoneNumber()
  @TransformFrenchPhoneNumber()
  phone: string;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}
