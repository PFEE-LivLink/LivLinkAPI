import { AnyKeys } from 'mongoose';
import { User } from '../schemas/user.schema';

export const BASIC_USER_RAW = (): AnyKeys<User> => {
  return {
    phone: '+33 6 66 66 66 66',
    type: 'Dependent',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'password-hash',
  };
};

export const HELPER_USER_RAW = (): AnyKeys<User> => {
  return {
    phone: '+33 6 77 77 77 77',
    type: 'Helper',
    firstName: 'Pierre',
    lastName: 'Dupont',
    passwordHash: 'password-hash',
  };
};
