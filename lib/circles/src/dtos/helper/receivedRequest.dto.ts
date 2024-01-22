import { Expose } from 'class-transformer';
import { UserDto } from 'lib/users/src/dtos/UserDto';
import { CirclePersonDto } from './circlePerson.dto';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'lib/users/src/entities';
import { CirclePerson } from '../../entities/circlePerson.entity';

export class ReceivedRequestDto {
  static from(user: User, circlePerson: CirclePerson) {
    const dto = new ReceivedRequestDto();
    dto.user = UserDto.from(user);
    dto.request = CirclePersonDto.from(circlePerson);
    return dto;
  }

  @Expose()
  @ApiProperty()
  @ValidateNested()
  user: UserDto;

  @Expose()
  @ApiProperty()
  @ValidateNested()
  request: CirclePersonDto;
}
