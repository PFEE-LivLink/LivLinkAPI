import { validate } from 'class-validator';
import { circlePersonBasicStub } from '../__test__/circlePerson.stub';
import { userBasicStub } from 'lib/users/src/__test__/users.stub';
import { UserCircles } from './userCircles.entity';
import { TestHelper } from 'lib/utils/TestHelper';
import { Repository } from 'typeorm';
import { User } from 'lib/users/src/entities';

describe('UserCircles entity', () => {
  const user = userBasicStub();

  let userCirclesRepository: Repository<UserCircles>;
  let usersRepository: Repository<User>;
  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
    userCirclesRepository = await TestHelper.instance.getRepository(UserCircles);
    usersRepository = await TestHelper.instance.getRepository(User);
    await usersRepository.save(user);
  });

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB();
  });

  afterEach(async () => {
    await TestHelper.instance.dropCollections();
  });

  it('duplicate phone should throw error', async () => {
    const circlePerson = circlePersonBasicStub();
    const uc1 = new UserCircles({ phone: user.phone, persons: [circlePerson] });
    const uc2 = new UserCircles({ phone: user.phone, persons: [] });
    await userCirclesRepository.save(uc1);
    await expect(userCirclesRepository.save(uc2)).rejects.toThrowError();
  });

  it('should be valid', async () => {
    const circlePerson = circlePersonBasicStub();
    const userCircles = new UserCircles({ phone: user.phone, persons: [circlePerson] });
    const errors = await validate(userCircles);
    expect(errors.length).toEqual(0);
  });

  describe('check required fields', () => {
    it('should have a phone field', async () => {
      const circlePerson = circlePersonBasicStub();
      const userCircles = new UserCircles({ phone: undefined, persons: [circlePerson] });
      const errors = await validate(userCircles);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should have a persons field', async () => {
      const userCircles = new UserCircles({ phone: user.phone, persons: undefined });
      const errors = await validate(userCircles);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check nested validation', () => {
    it('should not be valid if persons is not valid', async () => {
      const circlePerson = circlePersonBasicStub({ phone: undefined });
      const userCircles = new UserCircles({ phone: user.phone, persons: [circlePerson] });
      const errors = await validate(userCircles);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
