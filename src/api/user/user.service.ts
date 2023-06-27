import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  public async getUserFromPhone(phone: string): Promise<User | null> {
    const user = await this.userRepository.getUserFromPhone(phone);
    return user;
  }

  public async followDependent(helperId: string, dependentId: string): Promise<void> {
    const dependent = await this.userRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    const helper = await this.userRepository.findById(helperId);
    if (helper === null) {
      throw new Error('User not found');
    }
    if (helper.isDependent()) {
      throw new ForbiddenException('Dependent cannot follow another dependent');
    }
    helper.dependentsFollowed.push(dependent);
    dependent.helperFollowers.push(dependent);
    await this.userRepository.save(helper);
    await this.userRepository.save(dependent);
  }

  public async unfollowDependent(helperId: string, dependentId: string): Promise<void> {
    const dependent = await this.userRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    const helper = await this.userRepository.findById(helperId);
    if (helper === null) {
      throw new Error('User not found');
    }
    if (helper.isDependent()) {
      throw new ForbiddenException('Dependent cannot follow another dependent');
    }
    await helper.populate('dependentsFollowed');
    await dependent.populate('helperFollowers');
    const indexHelper = helper.dependentsFollowed.findIndex((dep) => dep._id === dependentId);
    const indexDependent = dependent.helperFollowers.findIndex((hel) => hel._id === helperId);
    helper.dependentsFollowed.splice(indexHelper, 1);
    dependent.helperFollowers.splice(indexDependent, 1);
    await this.userRepository.save(helper);
    await this.userRepository.save(dependent);
    // TODO: remove from circles
  }

  public async doHelperFollowDependent(helperId: string, dependentId: string): Promise<boolean> {
    const helper = await this.userRepository.findById(helperId);
    if (helper === null || !helper.isHelper()) {
      throw new NotFoundException('Helper not found');
    }
    await helper.populate('dependentsFollowed');
    return helper.dependentsFollowed.some((dep) => dep._id === dependentId);
  }

  public async doDependentIsFollowBy(dependentId: string, helperId: string): Promise<boolean> {
    const dependent = await this.userRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    await dependent.populate('helperFollowers');
    return dependent.helperFollowers.some((dep) => dep._id === helperId);
  }
}
