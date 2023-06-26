import { TransformFrenchPhoneNumber } from 'src/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'src/utils/validators';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { IsEnum } from 'class-validator';

export class SendCircleRequestRequestDto {
  @IsFrenchPhoneNumber()
  @TransformFrenchPhoneNumber()
  phone: string;

  @IsEnum(circleType)
  circle_type: CircleType;
}
