import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { userType, UserType } from 'lib/users/src/schema/user.schema';

export class RegisterRequestDTO {
  @Expose()
  @ApiProperty({ example: 'Paul' })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @Expose()
  @ApiProperty({ example: 'Vritcheff' })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @Expose()
  @ApiProperty({ enum: userType })
  @IsEnum(userType)
  public type: UserType;
}
