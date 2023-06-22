import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import { BASIC_USER_RAW } from './user.stubs';
import { MongoServerMemory } from 'src/api/database/mongoServerMemory';

describe('UserSchema', () => {
  let UserModel: Model<UserDocument>;

  let mongoConnectionMemory: Connection;
  beforeAll(async () => {
    await MongoServerMemory.start();
    mongoConnectionMemory = MongoServerMemory.getMongoConnection();
  });
  afterAll(async () => {
    await MongoServerMemory.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: mongoConnectionMemory.model(User.name, UserSchema),
        },
      ],
    }).compile();

    UserModel = module.get(getModelToken(User.name));
  });

  beforeEach(async () => {
    const collections = mongoConnectionMemory.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('check user type methods', () => {
    const user = new User();
    user.type = 'Dependent';
    expect(user.isDependent()).toBe(true);
    expect(user.isHelper()).toBe(false);
    user.type = 'Helper';
    expect(user.isDependent()).toBe(false);
    expect(user.isHelper()).toBe(true);
  });

  it('check if validation active', async () => {
    try {
      await UserModel.create({});
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }
  });

  it('check phone validator', async () => {
    const basicUserStub = BASIC_USER_RAW();
    const user = await UserModel.create(basicUserStub);
    expect(user).toBeDefined();
    expect(user.phone).toBe(basicUserStub.phone);
    expect(user.id).toBeDefined();

    // check a totally invalid phone number
    basicUserStub.phone = 'invalid-phone';
    try {
      await UserModel.create(basicUserStub);
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }

    // check if a non french phone number is accepted
    basicUserStub.phone = '+34 6 66 66 66 66';
    try {
      await UserModel.create(basicUserStub);
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }

    // check with no spaces in phone number
    basicUserStub.phone = '+33666666666';
    try {
      await UserModel.create(basicUserStub);
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }
  });

  it('check phone duplication', async () => {
    const basicUserStub = BASIC_USER_RAW();
    await UserModel.create(basicUserStub);
    try {
      await UserModel.create(basicUserStub);
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('MongoServerError');
    }
  });

  describe('check user type validator', () => {
    it('check Dependent', async () => {
      const basicUserStub = BASIC_USER_RAW();
      basicUserStub.type = 'Dependent';
      const user = await UserModel.create(basicUserStub);
      expect(user.type).toBe(basicUserStub.type);
    });

    it('check Helper', async () => {
      const basicUserStub = BASIC_USER_RAW();
      basicUserStub.type = 'Helper';
      const user = await UserModel.create(basicUserStub);
      expect(user.type).toBe(basicUserStub.type);
    });

    it('check invalid type', async () => {
      const basicUserStub = BASIC_USER_RAW();
      basicUserStub.type = 'invalid-type';
      try {
        await UserModel.create(basicUserStub);
        fail('Expected validation error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('ValidationError');
      }
    });
  });
});
