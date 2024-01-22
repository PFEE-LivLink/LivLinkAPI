import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { User, userType } from '../entities/user.entity';
import { IsPhoneNumber } from 'lib/utils/validators';
import { ObjectIdToString } from 'lib/utils/decorators/objectid2string.decorator';

export class UserDto {
  public static from(user: User) {
    return plainToInstance(UserDto, user);
  }

  @Expose()
  @ApiProperty()
  @ObjectIdToString()
  public _id: string;

  @Expose()
  @ApiProperty()
  @IsPhoneNumber()
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
