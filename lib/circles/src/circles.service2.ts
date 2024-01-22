/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Injectable, Logger } from '@nestjs/common';
import { UserCircles } from './entities/userCircles.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'lib/users/src/entities';
import { CirclePerson, CircleType } from './entities/circlePerson.entity';
import { v4 } from 'uuid';

@Injectable()
export class CirclesService {
  private readonly logger = new Logger(CirclesService.name);
  constructor(@InjectRepository(UserCircles) private readonly userCirclesRepo: MongoRepository<UserCircles>) {}

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
        persons: [{ id: v4(), phone, type: newCircleType, status: 'Pending' }],
      });
    }
    const personCircle = circlesDoc.persons.filter((personCircle) => personCircle.phone === phone);
    if (personCircle.length === 0) {
      circlesDoc.persons.push({ id: v4(), phone, type: newCircleType, status: 'Pending' });
      return await this.userCirclesRepo.save(circlesDoc);
    }
    personCircle[0].type = newCircleType;
    return await this.userCirclesRepo.save(circlesDoc);
  }

  async findRequest(user: User): Promise<CirclePerson[]> {
    const circlesDoc = await this.userCirclesRepo.find({
      persons: {
        $elemMatch: {
          phone: user.phone,
          status: 'Pending',
        },
      },
    });
    if (!circlesDoc) {
      return [];
    }
    const persons = circlesDoc.map((circleDoc) =>
      circleDoc.persons.filter(
        (personCircle) => personCircle.status === 'Pending' && personCircle.phone === user.phone,
      ),
    );
    return persons.flat();
  }

  async acceptRequest(user: User, requestId: string) {
    const circlesDoc = await this.userCirclesRepo.find({
      persons: {
        $elemMatch: {
          phone: user.phone,
          status: 'Pending',
          id: requestId,
        },
      },
    });
    if (!circlesDoc || circlesDoc.length === 0) {
      return;
    }
    const request = circlesDoc[0].persons.filter((personCircle) => personCircle.id === requestId);
    if (request.length === 0) {
      return;
    }
    request[0].status = 'Accepted';
    await this.userCirclesRepo.save(circlesDoc[0]);
  }

  async rejectRequest(user: User, requestId: string) {
    const circlesDoc = await this.userCirclesRepo.find({
      persons: {
        $elemMatch: {
          phone: user.phone,
          status: 'Pending',
          id: requestId,
        },
      },
    });
    if (!circlesDoc || circlesDoc.length === 0) {
      return;
    }
    circlesDoc[0].persons = circlesDoc[0].persons.filter((personCircle) => personCircle.id !== requestId);
    await this.userCirclesRepo.save(circlesDoc[0]);
  }

  async getPhonesThanHaveUserInCircle(user: User): Promise<string[]> {
    const circlesDoc = await this.userCirclesRepo.find({
      persons: {
        $elemMatch: {
          phone: user.phone,
          status: 'Accepted',
        },
      },
    });
    if (!circlesDoc || circlesDoc.length === 0) {
      return [];
    }
    return circlesDoc.map((circleDoc) => circleDoc.phone);
  }
}
