import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permissions.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'lib/users';
import { CirclesService } from 'lib/circles/src/circles.service2';
import { CircleType } from 'lib/circles/src/entities/circlePerson.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserPermission) private readonly permsRepository: Repository<UserPermission>,
    private readonly userService: UsersService,
    private readonly circlesService: CirclesService,
  ) {}

  async getMyPermissions(user: string): Promise<UserPermission | null> {
    return await this.permsRepository.findOne({ where: { phone: user } });
  }

  async havePermission(dependentPhone: string, helperPhone: string, permission: string): Promise<boolean> {
    const dependent = await this.userService.getByPhone(dependentPhone);
    const helper = await this.userService.getByPhone(helperPhone);
    if (!helper || !dependent) {
      return false;
    }
    const circleLevel = await this.circlesService.getCircleLevelOfUser(helper, dependent);
    if (circleLevel === null) {
      return false;
    }
    const permsDoc = await this.permsRepository.findOne({ where: { phone: dependentPhone } });
    if (!permsDoc) {
      return false;
    }
    let perms = permsDoc.circle1;
    if (circleLevel === 'Mid') {
      perms = permsDoc.circle2;
    } else if (circleLevel === 'Distant') {
      perms = permsDoc.circle3;
    }
    const perm = perms[permission];
    if (!perm) {
      return false;
    }
    return perm;
  }

  async setPermission(
    dependentPhone: string,
    circleType: CircleType,
    permission: string,
    value: boolean,
  ): Promise<void> {
    const permsDoc = await this.permsRepository.findOne({ where: { phone: dependentPhone } });
    if (!permsDoc) {
      return;
    }
    let perms = permsDoc.circle1;
    if (circleType === 'Mid') {
      perms = permsDoc.circle2;
    } else if (circleType === 'Distant') {
      perms = permsDoc.circle3;
    }
    perms[permission] = value;
    await this.permsRepository.save(permsDoc);
  }
}
