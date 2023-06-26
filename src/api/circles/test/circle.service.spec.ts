import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { MongoServerMemory } from 'src/api/database/mongoServerMemory';
import { User, UserSchema } from 'src/api/user/schemas/user.schema';
import { UserCircles, UserCirclesSchema } from '../schemas/user-circles.schema';
import { CirclesService } from '../circle.service';
import { CirclesRepository } from '../circle.repository';
import { UsersRepository } from 'src/api/user/user.repository';
import { BASIC_USER_RAW, HELPER_USER_RAW } from 'src/api/user/tests/user.stubs';
import { circleType } from '../schemas/circle.schema';
import { circlePersonStatus } from '../schemas/circle-person.schema';

describe('CircleService', () => {
  let userRepository: UsersRepository;
  let circlesRepository: CirclesRepository;
  let circleService: CirclesService;
  let user: User;

  const phonesCount = 10;
  const phones: string[] = [];

  let mongoConnectionMemory: Connection;
  beforeAll(async () => {
    await MongoServerMemory.start();
    mongoConnectionMemory = MongoServerMemory.getMongoConnection();

    for (let i = 0; i < phonesCount; i++) {
      const phone = `+33 6 43 45 76 ${i.toString().padStart(2, '0')}`;
      phones.push(phone);
    }
  });
  afterAll(async () => {
    await MongoServerMemory.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CirclesService,
        CirclesRepository,
        UsersRepository,
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

    userRepository = module.get(UsersRepository);
    circlesRepository = module.get(CirclesRepository);
    circleService = module.get(CirclesService);

    const collections = mongoConnectionMemory.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    user = await userRepository.create(BASIC_USER_RAW());
  });

  describe('addPersonToCircleHandler', () => {
    it('basic add request to first circle', async () => {
      const phone = phones[0];
      const personCircle = await circleService.addPersonToCircleHandler(user, phone, circleType.High);
      expect(personCircle).toBeDefined();
      expect(personCircle.circleType).toBe(circleType.High);
      expect(personCircle.phone).toBe(phone);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
    });
    it('basic add request to second circle', async () => {
      const phone = phones[0];
      const personCircle = await circleService.addPersonToCircleHandler(user, phone, circleType.Medium);
      expect(personCircle).toBeDefined();
      expect(personCircle.circleType).toBe(circleType.Medium);
      expect(personCircle.phone).toBe(phone);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
    });
    it('basic add request to third circle', async () => {
      const phone = phones[0];
      const personCircle = await circleService.addPersonToCircleHandler(user, phone, circleType.Low);
      expect(personCircle).toBeDefined();
      expect(personCircle.circleType).toBe(circleType.Low);
      expect(personCircle.phone).toBe(phone);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
    });

    it('helpers cannot add people to circles', async () => {
      const helper = await userRepository.create(HELPER_USER_RAW());
      await expect(circleService.addPersonToCircleHandler(helper, phones[0], circleType.High)).rejects.toThrowError();
    });

    it('helpers cannot add people to circles', async () => {
      const helper = await userRepository.create(HELPER_USER_RAW());
      await expect(circleService.addPersonToCircleHandler(helper, phones[0], circleType.High)).rejects.toThrowError();
    });

    it('basic add many unique people', async () => {
      const personCircle1 = await circleService.addPersonToCircleHandler(user, phones[0], circleType.High);
      const personCircle2 = await circleService.addPersonToCircleHandler(user, phones[1], circleType.High);
      expect(personCircle1.status).toBe(circlePersonStatus.Pending);
      expect(personCircle2.status).toBe(circlePersonStatus.Pending);
      const personCircle3 = await circleService.addPersonToCircleHandler(user, phones[2], circleType.Medium);
      const personCircle4 = await circleService.addPersonToCircleHandler(user, phones[3], circleType.Medium);
      expect(personCircle3.status).toBe(circlePersonStatus.Pending);
      expect(personCircle4.status).toBe(circlePersonStatus.Pending);
      const personCircle5 = await circleService.addPersonToCircleHandler(user, phones[4], circleType.Medium);
      const personCircle6 = await circleService.addPersonToCircleHandler(user, phones[5], circleType.Medium);
      expect(personCircle5.status).toBe(circlePersonStatus.Pending);
      expect(personCircle6.status).toBe(circlePersonStatus.Pending);
    });

    it('reset a person after have been rejected', async () => {
      let personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Medium);
      // simulated reject
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Rejected,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.Medium);
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Rejected,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.High);
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Rejected,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Low);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.Low);
    });

    it('basic set multiple time the same person, stay in pending status', async () => {
      let personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.Low);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.Low);
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.Medium);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(1);
    });

    it('downgrade a person circle, should stay accepted', async () => {
      let personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.High);
      // simulated acceptation
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Accepted,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Accepted);
      expect(personCircle.circleType).toBe(circleType.Medium);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(1);
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Accepted);
      expect(personCircle.circleType).toBe(circleType.Medium);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(1);
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Low);
      expect(personCircle.status).toBe(circlePersonStatus.Accepted);
      expect(personCircle.circleType).toBe(circleType.Low);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(1);
    });

    it('upgrade a person circle, should pass to pending', async () => {
      let personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Medium);
      // simulated acceptation
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Accepted,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect(personCircle.circleType).toBe(circleType.High);
      const personCircles = await circlesRepository.findPersonInUserCircles(user, personCircle.phone);
      expect(personCircles.length).toBe(2);
      const firstPersonCircle = personCircles[0];
      const secondPersonCircle = personCircles[1];
      expect(firstPersonCircle.phone).toBe(secondPersonCircle.phone);
      expect(firstPersonCircle.isPending()).toBe(true);
      expect(secondPersonCircle.isAccepted()).toBe(true);
    });

    it('other requests with already a accepted one', async () => {
      let personCircle = await circleService.addPersonToCircleHandler(user, phones[0], circleType.Low);
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Accepted,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(2);
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(2);
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Rejected,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.High);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      await circlesRepository.setPersonCircleStatus(
        user,
        personCircle.phone,
        personCircle.circleType,
        circlePersonStatus.Rejected,
      );
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.Medium);
      expect(personCircle.status).toBe(circlePersonStatus.Pending);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(2);
      personCircle = await circleService.addPersonToCircleHandler(user, personCircle.phone, circleType.Low);
      expect(personCircle.status).toBe(circlePersonStatus.Accepted);
      expect((await circlesRepository.findPersonInUserCircles(user, personCircle.phone)).length).toBe(1);
    });
  });
});
