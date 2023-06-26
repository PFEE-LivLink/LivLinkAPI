import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from '../database/entity.repository';
import { User } from '../user/schemas/user.schema';
import { UserCircles, UserCirclesDocument } from './schemas/user-circles.schema';
import { CircleType, circleType } from './schemas/circle.schema';
import { CirclePerson, CirclePersonStatus, circlePersonStatus } from './schemas/circle-person.schema';

@Injectable()
export class CirclesRepository extends EntityRepository<UserCirclesDocument> {
  constructor(@InjectModel(UserCircles.name) model: Model<UserCirclesDocument>) {
    super(model);
  }

  public async getDocument(user: User): Promise<UserCirclesDocument | null> {
    return await this.findOne({ user });
  }

  public async hasDocument(user: User): Promise<boolean> {
    return (await this.getDocument(user)) !== null;
  }

  public async getOrCreateDocument(user: User): Promise<UserCirclesDocument> {
    const document = await this.getDocument(user);
    if (document !== null) {
      return document;
    }
    return await this.create({ user });
  }

  public async findPersonInUserCircles(
    user: User,
    phone: string,
  ): Promise<Array<CirclePerson & { circleType: CircleType }>> {
    const userCircles = await this.getOrCreateDocument(user);
    let circlePersons: Array<CirclePerson & { circleType: CircleType }> = [];

    for (const circleTypeKey of Object.values(circleType)) {
      const cp = userCircles.circles[circleTypeKey].persons.filter((person) => person.phone === phone);
      circlePersons = circlePersons.concat(cp.map((person) => Object.assign(person, { circleType: circleTypeKey })));
    }
    return circlePersons;
  }

  public async addPersonToCircle(user: User, phone: string, newCircleType: CircleType): Promise<CirclePerson> {
    const userCircles = await this.getOrCreateDocument(user);
    const cp = new CirclePerson(phone, circlePersonStatus.Pending);
    userCircles.circles[newCircleType].persons.push(cp);
    await userCircles.save();
    return cp;
  }

  public async movePersonCircle(
    user: User,
    phone: string,
    currentCircleType: CircleType,
    newCircleType: CircleType,
    status: CirclePersonStatus,
  ): Promise<CirclePerson> {
    const userCircles = await this.getOrCreateDocument(user);
    const fromCircle = userCircles.circles[currentCircleType];
    const toCircle = userCircles.circles[newCircleType];
    const cp = new CirclePerson(phone, status);
    toCircle.persons.push(cp);
    const index = fromCircle.persons.findIndex((p) => p.phone === phone);
    fromCircle.persons.splice(index, 1);
    await userCircles.save();
    return cp;
  }

  public async duplicatePersonCircle(
    user: User,
    phone: string,
    currentCircleType: CircleType,
    newCircleType: CircleType,
  ): Promise<CirclePerson> {
    const userCircles = await this.getOrCreateDocument(user);
    const fromCircle = userCircles.circles[currentCircleType];
    const personCircle = fromCircle.persons.find((p) => p.phone === phone);
    if (personCircle == null) {
      throw new Error('Person circle not found');
    }
    return await this.addPersonToCircle(user, personCircle.phone, newCircleType);
  }

  public async removePersonCircle(user: User, phone: string, circleType: CircleType): Promise<void> {
    const userCircles = await this.getOrCreateDocument(user);
    const circle = userCircles.circles[circleType];
    const index = circle.persons.findIndex((p) => p.phone === phone);
    circle.persons.splice(index, 1);
    await userCircles.save();
  }

  public async setPersonCircleStatus(
    user,
    phone: string,
    circleType: CircleType,
    status: CirclePersonStatus,
  ): Promise<void> {
    const userCircles = await this.getOrCreateDocument(user);
    const circle = userCircles.circles[circleType];
    const personCircle = circle.persons.find((p) => p.phone === phone);
    if (personCircle == null) {
      throw new Error('Person circle not found');
    }
    personCircle.status = status;
    await userCircles.save();
  }
}
