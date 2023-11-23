import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { IsFrenchPhoneNumber } from 'lib/utils/validators';
import { userType } from '../schema/user.schema';

export class UserDto {
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
