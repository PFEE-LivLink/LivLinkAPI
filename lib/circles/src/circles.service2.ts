/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Injectable, Logger } from '@nestjs/common';
import { UserCircles } from './entities/userCircles.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'lib/users/src/entities';
import { CirclePerson, CircleType } from './entities/circlePerson.entity';

@Injectable()
export class CirclesService {
  private readonly logger = new Logger(CirclesService.name);
  constructor(@InjectRepository(UserCircles) private readonly userCirclesRepo: Repository<UserCircles>) {}

  public async getCircleLevelOfUser(user: User, target: User): Promise<CircleType | null> {
    const circlesDoc = await this.userCirclesRepo.findOne({ where: { phone: user.phone } });
    if (!circlesDoc) {
      return null;
    }
    const personCircles = circlesDoc.persons.filter(
      (personCircle) => personCircle.phone === target.phone && personCircle.status === 'Accepted',
    );
    if (personCircles.length === 0) {
      return null;
    }
    return personCircles[0].type;
  }

  async getUsersInCircle(user: User): Promise<CirclePerson[]> {
    const circlesDoc = await this.userCirclesRepo.findOne({ where: { phone: user.phone } });
    if (!circlesDoc) {
      return [];
    }
    const persons = circlesDoc.persons.filter((personCircle) => personCircle.status === 'Accepted');
    return persons;
  }

  async getUsersRequested(user: User): Promise<CirclePerson[]> {
    const circlesDoc = await this.userCirclesRepo.findOne({ where: { phone: user.phone } });
    if (!circlesDoc) {
      return [];
    }
    const persons = circlesDoc.persons.filter((personCircle) => personCircle.status === 'Pending');
    return persons;
  }

  async addPersonToCircleHandler(user: User, phone: string, newCircleType: CircleType) {
    const circlesDoc = await this.userCirclesRepo.findOne({ where: { phone: user.phone } });
    if (!circlesDoc) {
      return await this.userCirclesRepo.save({
        phone: user.phone,
        persons: [{ phone, type: newCircleType, status: 'Pending' }],
      });
    }
    const personCircle = circlesDoc.persons.filter((personCircle) => personCircle.phone === phone);
    if (personCircle.length === 0) {
      circlesDoc.persons.push({ phone, type: newCircleType, status: 'Pending' });
      return await this.userCirclesRepo.save(circlesDoc);
    }
    personCircle[0].type = newCircleType;
    return await this.userCirclesRepo.save(circlesDoc);
  }
}
