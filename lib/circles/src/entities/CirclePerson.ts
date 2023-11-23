import { CirclePersonStatus } from '../schemas/circle-person.schema';
import { CircleType } from '../schemas/circle.schema';
import * as schemaClass from '../schemas/circle-person.schema';

export class CirclePerson {
  static from(circlePerson: schemaClass.CirclePerson, circleType: CircleType): CirclePerson {
    return new CirclePerson(circlePerson.phone, circlePerson.status, circleType);
  }

  constructor(phone: string, status: CirclePersonStatus, circleType: CircleType) {
    this.id = 'XXX';
    this.phone = phone;
    this.status = status;
    this.circleType = circleType;
  }

  id: string;
  phone: string;
  status: CirclePersonStatus;
  circleType: CircleType;
}
