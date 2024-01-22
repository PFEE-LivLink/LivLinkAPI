import { Repository } from 'typeorm';
import { TestHelper } from '../../../utils/TestHelper';
import { User, userType } from './user.entity';
import { validate } from 'class-validator';
import { userBasicStub } from '../__test__/users.stub';

let usersRepository: Repository<User>;
beforeAll(async () => {
  await TestHelper.instance.setupTestDB();
  usersRepository = await TestHelper.instance.getRepository(User);
});

afterAll(async () => {
  await TestHelper.instance.teardownTestDB();
});

afterEach(async () => {
  await TestHelper.instance.dropCollections();
});

describe('UserEntity', () => {
  it('duplicate phone number should throw error', async () => {
    const phone = 'XXXXXXXXX';
    const u1 = new User({ phone });
    const u2 = new User({ phone });
    await usersRepository.save(u1);
    await expect(usersRepository.save(u2)).rejects.toThrowError();
  });

  it('should be validate', async () => {
    const u = userBasicStub({});
    const errors = await validate(u);
    expect(errors.length).toBe(0);
  });

  describe('check required fields', () => {
    it('should not be validate if phone is not provided', async () => {
      const u = userBasicStub({ phone: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if firstName is not provided', async () => {
      const u = userBasicStub({ firstName: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if lastName is not provided', async () => {
      const u = userBasicStub({ lastName: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if type is not provided', async () => {
      const u = userBasicStub({ type: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check phone', () => {
    it('not be validate if invalid', async () => {
      const u = userBasicStub({ phone: 'notaphone' });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should validate in +33XXXXXXXXX format', async () => {
      const u = userBasicStub({ phone: '+33666666666' });
      const errors = await validate(u);
      expect(errors.length).toBe(0);
    });
  });

  describe('check firstName / lastName', () => {
    it('firstName not be validate if invalid, empty', async () => {
      const u = userBasicStub({ firstName: '' });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('lastName not be validate if invalid, empty', async () => {
      const u = userBasicStub({ lastName: '' });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check types', () => {
    for (const type of Object.values(userType)) {
      it(`should validate ${type}`, async () => {
        const u = userBasicStub({ type });
        const errors = await validate(u);
        expect(errors.length).toBe(0);
      });
    }

    it('should not validate if type is not in enum', async () => {
      const u = userBasicStub({ type: 'notavalidtype' as any });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('is[Type] methods check', () => {
    it('should return true if isHelper', async () => {
      const u = userBasicStub({ type: 'Helper' });
      expect(u.isHelper()).toBe(true);
      expect(u.isDependent()).toBe(false);
    });

    it('should return true if isDependent', async () => {
      const u = userBasicStub({ type: 'Dependent' });
      expect(u.isHelper()).toBe(false);
      expect(u.isDependent()).toBe(true);
    });
  });
});
