import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schema/user.schema';
import { Pagination, PaginationMeta } from 'lib/utils/dtos/pagination/pagination';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async registerUser(user: Partial<UserDocument>) {
    return await this.usersRepository.create(user);
  }

  async findAll(paginationOption?: PaginationQueryDto): Promise<Pagination<User>> {
    const users = await this.usersRepository.find({});
    let slicedUsers: User[] = [];
    if (paginationOption) {
      slicedUsers = users.slice(
        (paginationOption.page - 1) * paginationOption.limit,
        paginationOption.page * paginationOption.limit,
      );
    }
    paginationOption = { page: paginationOption?.page ?? 1, limit: paginationOption?.limit ?? users.length };

    return {
      data: slicedUsers,
      meta: PaginationMeta.from(paginationOption.page, paginationOption.limit, users.length),
    };
  }

  async getByPhone(phone: string) {
    return await this.usersRepository.findOne({ phone });
  }

  async getById(id: string) {
    return await this.usersRepository.findById(id);
  }

  public async followDependent(helperId: string, dependentId: string): Promise<void> {
    const dependent = await this.usersRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    const helper = await this.usersRepository.findById(helperId);
    if (helper === null) {
      throw new Error('User not found');
    }
    if (helper.isDependent()) {
      throw new ForbiddenException('Dependent cannot follow another dependent');
    }
    helper.dependentsFollowed.push(dependent);
    dependent.helperFollowers.push(dependent);
    await this.usersRepository.save(helper);
    await this.usersRepository.save(dependent);
  }

  public async unfollowDependent(helperId: string, dependentId: string): Promise<void> {
    const dependent = await this.usersRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    const helper = await this.usersRepository.findById(helperId);
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
    await this.usersRepository.save(helper);
    await this.usersRepository.save(dependent);
    // TODO: remove from circles
  }

  public async doHelperFollowDependent(helperId: string, dependentId: string): Promise<boolean> {
    const helper = await this.usersRepository.findById(helperId);
    if (helper === null || !helper.isHelper()) {
      throw new NotFoundException('Helper not found');
    }
    await helper.populate('dependentsFollowed');
    return helper.dependentsFollowed.some((dep) => dep._id === dependentId);
  }

  public async doDependentIsFollowBy(dependentId: string, helperId: string): Promise<boolean> {
    const dependent = await this.usersRepository.findById(dependentId);
    if (dependent === null || !dependent.isDependent()) {
      throw new NotFoundException('Dependent not found');
    }
    await dependent.populate('helperFollowers');
    return dependent.helperFollowers.some((dep) => dep._id === helperId);
  }
}
