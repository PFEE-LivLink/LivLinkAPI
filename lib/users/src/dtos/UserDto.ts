import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { IsFrenchPhoneNumber } from 'lib/utils/validators';
import { User, userType } from '../schema/user.schema';

export class UserDto {
  public static from(user: User) {
    return plainToInstance(UserDto, user);
  }

  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  @IsFrenchPhoneNumber()
  public phone: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public firstName: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public lastName: string;

  @Expose()
  @ApiProperty({ enum: userType })
  @IsEnum(userType)
  public type: string;
}
