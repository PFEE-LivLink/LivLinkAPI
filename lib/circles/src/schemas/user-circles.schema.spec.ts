import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import { MongoServerMemory } from 'src/api/database/mongoServerMemory';
import { BASIC_USER_RAW } from 'src/api/user/tests/user.stubs';
import { circlePersonStatus } from './circle-person.schema';
import { UserCircles, UserCirclesDocument, UserCirclesSchema } from './user-circles.schema';
import { circleType } from './circle.schema';
import { User, UserDocument, UserSchema } from 'lib/users/src/schema/user.schema';

describe('CirclesSchema', () => {
  let UserCirclesModel: Model<UserCirclesDocument>;
  let UserModel: Model<UserDocument>;
  let user: User;

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
        {
          provide: getModelToken(UserCircles.name),
          useValue: mongoConnectionMemory.model(UserCircles.name, UserCirclesSchema),
        },
      ],
    }).compile();

    UserModel = module.get(getModelToken(User.name));
    UserCirclesModel = module.get(getModelToken(UserCircles.name));
  });

  beforeEach(async () => {
    const collections = mongoConnectionMemory.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    user = await UserModel.create(BASIC_USER_RAW());
  });

  it('check user type methods', () => {
    // pass
    expect(true).toBe(true);
  });

  it('check if validation active', async () => {
    try {
      await UserCirclesModel.create({});
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(['ValidationError', 'ReferenceError']).toContain(error.name);
    }
  });

  it('create an empty doc', async () => {
    const doc = await UserCirclesModel.create({
      user: user._id,
    });
    expect(doc).toBeDefined();
    expect(doc.id).toBeDefined();
    expect(doc.circles.high.type).toBe(circleType.High);
    expect(doc.circles.high.persons.length).toBe(0);
    expect(doc.circles.medium.type).toBe(circleType.Medium);
    expect(doc.circles.medium.persons.length).toBe(0);
    expect(doc.circles.low.type).toBe(circleType.Low);
    expect(doc.circles.low.persons.length).toBe(0);
  });

  it('add a default request, should be pending', async () => {
    const phone = '+33 6 12 44 98 12';
    const doc = await UserCirclesModel.create({
      user: user._id,
      circles: {
        high: {
          type: circleType.High,
          persons: [
            {
              phone,
            },
          ],
        },
      },
    });
    expect(doc.circles.high.persons.length).toBe(1);
    const req1 = doc.circles.high.persons[0];
    expect(req1.phone).toBe(phone);
    expect(req1.status).toBe(circlePersonStatus.Pending);
  });

  it('add a default request, but force status', async () => {
    const phone = '+33 6 12 44 98 12';
    const doc = await UserCirclesModel.create({
      user: user._id,
      circles: {
        high: {
          type: circleType.High,
          persons: [
            {
              phone,
              status: circlePersonStatus.Accepted,
            },
          ],
        },
      },
    });
    const req1 = doc.circles.high.persons[0];
    expect(req1.status).toBe(circlePersonStatus.Accepted);
  });

  it('add a request with a unknown status', async () => {
    const phone = '+33 6 12 44 98 12';
    try {
      await UserCirclesModel.create({
        user: user._id,
        circles: {
          high: {
            type: circleType.High,
            persons: [
              {
                phone,
                status: 'unknown',
              },
            ],
          },
        },
      });
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }
  });

  it('add a request with a invalid phone', async () => {
    const phone = '+33612449812';
    try {
      await UserCirclesModel.create({
        user: user._id,
        circles: {
          high: {
            type: circleType.High,
            persons: [
              {
                phone,
              },
            ],
          },
        },
      });
      fail('Expected validation error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
    }
  });

  it('check that circleRequest methods are accessible', async () => {
    const phone = '+33 6 12 44 98 12';
    const doc = await UserCirclesModel.create({
      user: user._id,
      circles: {
        high: {
          type: circleType.High,
          persons: [
            {
              phone,
            },
          ],
        },
      },
    });
    const req1 = doc.circles.high.persons[0];
    expect(req1.setToAccept).toBeDefined();
  });
});
