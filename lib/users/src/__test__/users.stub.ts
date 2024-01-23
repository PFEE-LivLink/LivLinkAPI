import { User, UserType } from '../entities';
import { faker } from '@faker-js/faker';

export const userBasicStub = (overwrite?: Partial<User>) => {
  return new User({
    phone: `+336${faker.string.numeric(8)}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    type: faker.string.fromCharacters(['Dependent', 'Helper']) as UserType,
    ...overwrite,
  });
};
