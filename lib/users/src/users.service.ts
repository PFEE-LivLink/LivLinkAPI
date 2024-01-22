import { User } from './entities/user.entity';
import { Pagination, PaginationMeta } from 'lib/utils/dtos/pagination/pagination';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidationError } from 'lib/utils/validationError';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async registerUser(user: User) {
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors.toString());
    }
    return await this.userRepository.save(user);
  }

  async getUsersByPage(paginationOption?: PaginationQueryDto): Promise<Pagination<User>> {
    const limit = paginationOption?.limit ?? undefined;
    const page = paginationOption?.page ?? 1;

    const usersCount = await this.userRepository.count();
    const users = await this.userRepository.find({
      skip: limit ? (page - 1) * limit : undefined,
      take: limit,
    });

    return {
      data: users,
      meta: PaginationMeta.from(page, limit ?? usersCount, usersCount),
    };
  }

  async getByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getById(id: string) {
    return await this.userRepository.findOne({ where: { _id: new mongoose.Types.ObjectId(id) } });
  }

  // public async followDependent(helperId: string, dependentId: string): Promise<void> {
  //   const dependent = await this.usersRepository.findById(dependentId);
  //   if (dependent === null || !dependent.isDependent()) {
  //     throw new NotFoundException('Dependent not found');
  //   }
  //   const helper = await this.usersRepository.findById(helperId);
  //   if (helper === null) {
  //     throw new Error('User not found');
  //   }
  //   if (helper.isDependent()) {
  //     throw new ForbiddenException('Dependent cannot follow another dependent');
  //   }
  //   helper.dependentsFollowed.push(dependent);
  //   dependent.helperFollowers.push(dependent);
  //   await this.usersRepository.save(helper);
  //   await this.usersRepository.save(dependent);
  // }

  // public async unfollowDependent(helperId: string, dependentId: string): Promise<void> {
  //   const dependent = await this.usersRepository.findById(dependentId);
  //   if (dependent === null || !dependent.isDependent()) {
  //     throw new NotFoundException('Dependent not found');
  //   }
  //   const helper = await this.usersRepository.findById(helperId);
  //   if (helper === null) {
  //     throw new Error('User not found');
  //   }
  //   if (helper.isDependent()) {
  //     throw new ForbiddenException('Dependent cannot follow another dependent');
  //   }
  //   await helper.populate('dependentsFollowed');
  //   await dependent.populate('helperFollowers');
  //   const indexHelper = helper.dependentsFollowed.findIndex((dep) => dep._id === dependentId);
  //   const indexDependent = dependent.helperFollowers.findIndex((hel) => hel._id === helperId);
  //   helper.dependentsFollowed.splice(indexHelper, 1);
  //   dependent.helperFollowers.splice(indexDependent, 1);
  //   await this.usersRepository.save(helper);
  //   await this.usersRepository.save(dependent);
  //   // TODO: remove from circles
  // }

  // public async doHelperFollowDependent(helperId: string, dependentId: string): Promise<boolean> {
  //   const helper = await this.usersRepository.findById(helperId);
  //   if (helper === null || !helper.isHelper()) {
  //     throw new NotFoundException('Helper not found');
  //   }
  //   await helper.populate('dependentsFollowed');
  //   return helper.dependentsFollowed.some((dep) => dep._id === dependentId);
  // }

  // public async doDependentIsFollowBy(dependentId: string, helperId: string): Promise<boolean> {
  //   const dependent = await this.usersRepository.findById(dependentId);
  //   if (dependent === null || !dependent.isDependent()) {
  //     throw new NotFoundException('Dependent not found');
  //   }
  //   await dependent.populate('helperFollowers');
  //   return dependent.helperFollowers.some((dep) => dep._id === helperId);
  // }
}
