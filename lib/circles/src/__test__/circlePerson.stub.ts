import { faker } from '@faker-js/faker';
import {
  CirclePerson,
  CirclePersonStatus,
  CircleType,
  circlePersonStatus,
  circleType,
} from '../entities/circlePerson.entity';

export const circlePersonBasicStub = (overwrite?: Partial<CirclePerson>) => {
  return new CirclePerson({
    phone: `+336${faker.string.numeric(8)}`,
    type: faker.string.fromCharacters(Object.values(circleType)) as CircleType,
    status: faker.string.fromCharacters(Object.values(circlePersonStatus)) as CirclePersonStatus,
    ...overwrite,
  });
};
