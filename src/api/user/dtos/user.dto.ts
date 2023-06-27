import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  _id: string;

  @IsString()
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;
}
