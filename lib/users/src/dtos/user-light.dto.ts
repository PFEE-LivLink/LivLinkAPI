import { PickType } from '@nestjs/mapped-types';
import { UserLight } from '../entities';
import { UserDto } from './UserDto';

export class UserLightDto extends PickType(UserDto, ['id', 'firstName', 'lastName', 'phone'] as const) {
  static fromUser(user: UserLight): UserLightDto {
    const userLightDto = new UserLightDto();
    userLightDto.id = user._id;
    userLightDto.firstName = user.firstName;
    userLightDto.lastName = user.lastName;
    userLightDto.phone = user.phone;
    return userLightDto;
  }
}
