import { IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { UserType, userType } from 'src/api/user/schemas/user.schema';
import { TransformFrenchPhoneNumber } from 'src/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'src/utils/validators';

export class RegisterRequestDTO {
  @IsStrongPassword()
  public password: string;

  @TransformFrenchPhoneNumber()
  @IsFrenchPhoneNumber()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsEnum(userType)
  public type: UserType;
}
