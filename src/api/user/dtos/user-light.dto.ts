import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { UserLight } from '../entities';

export class UserLightDto extends PickType(UserDto, ['_id', 'first_name', 'last_name', 'phone'] as const) {
  static fromUser(user: UserLight): UserLightDto {
    const userLightDto = new UserLightDto();
    userLightDto._id = user._id;
    userLightDto.first_name = user.firstName;
    userLightDto.last_name = user.lastName;
    userLightDto.phone = user.phone;
    return userLightDto;
  }
}
