import { Injectable } from '@nestjs/common';
import { UserDetails, UserLight, UserUltraLight } from './entities/';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './schema/user.schema';

export const userInfoLevel = {
  UltraLight: 'UltraLight',
  Light: 'Light',
  Details: 'Details',
} as const;
export type UserInfoLevel = (typeof userInfoLevel)[keyof typeof userInfoLevel];

type UserInfo = UserDetails | UserLight | UserUltraLight;

@Injectable()
export class UsersInfosService {
  constructor(private readonly usersService: UsersService, private readonly userRepository: UsersRepository) {}

  public async hasUltraLightAuthorization(user: User, targetUser: User): Promise<boolean> {
    if (user.phone === targetUser.phone) {
      return true;
    }
    if (user.isDependent() && targetUser.isDependent()) {
      return false;
    }
    if (user.isDependent()) {
      const isDependentFollowedByTargetUser = await this.usersService.doDependentIsFollowBy(user._id, targetUser._id);
      return isDependentFollowedByTargetUser;
    }
    if (targetUser.isDependent()) {
      const isDependentFollowedByTargetUser = await this.usersService.doHelperFollowDependent(user._id, targetUser._id);
      return isDependentFollowedByTargetUser;
    }
    // here user and targetUser are helpers
    return false; // TODO: implement this case
  }

  public async hasLightAuthorization(user: User, targetUser: User): Promise<boolean> {
    return await this.hasUltraLightAuthorization(user, targetUser);
  }

  public async hasDetailsAuthorization(user: User, targetUser: User): Promise<boolean> {
    if (user.phone !== targetUser.phone) {
      return false;
    }
    return true;
  }

  public async getInfo(user: User, phone: string, infoLevel: UserInfoLevel): Promise<UserInfo | string> {
    const targetUser = await this.usersService.getByPhone(phone);
    if (targetUser === null) {
      return phone;
    }
    if (infoLevel === userInfoLevel.UltraLight && (await this.hasUltraLightAuthorization(user, targetUser))) {
      return UserUltraLight.fromUser(targetUser);
    }
    if (infoLevel === userInfoLevel.Light && (await this.hasLightAuthorization(user, targetUser))) {
      return UserLight.fromUser(targetUser);
    }
    if (infoLevel === userInfoLevel.Details && (await this.hasDetailsAuthorization(user, targetUser))) {
      return UserDetails.fromUser(targetUser);
    }
    throw new Error('Unauthorized');
  }
}
