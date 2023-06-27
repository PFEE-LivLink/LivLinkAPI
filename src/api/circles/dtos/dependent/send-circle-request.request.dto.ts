import { TransformFrenchPhoneNumber } from 'src/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'src/utils/validators';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCircleRequestRequestDto {
  @ApiProperty({ type: String })
  @IsFrenchPhoneNumber()
  @TransformFrenchPhoneNumber()
  phone: string;

  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}
