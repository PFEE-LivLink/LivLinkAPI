import { IsStrongPassword } from 'class-validator';
import { TransformFrenchPhoneNumber } from 'src/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'src/utils/validators';

export class LoginRequestDTO {
  @IsStrongPassword()
  public password: string;

  @TransformFrenchPhoneNumber()
  @IsFrenchPhoneNumber()
  public phone: string;
}
