import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestHelper } from 'lib/utils/TestHelper';
import { UsersService } from './users.service';
import { User } from './entities';
import { DataSource } from 'typeorm';
import { userBasicStub } from './__test__/users.stub';

describe('UsersService', () => {
  let usersService: UsersService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    await TestHelper.instance.startTestDB();
  });

  afterAll(async () => {
    await TestHelper.instance.stopTestDB();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...TestHelper.instance.getConfig(),
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [],
      providers: [UsersService],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    const connection = moduleRef.get<DataSource>(DataSource);
    await connection.dropDatabase();
    if (connection.isInitialized) {
      await connection.destroy();
    }
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it('basic user registration', async () => {
    const user = userBasicStub();
    const createdUser = await usersService.registerUser(user);
    expect(createdUser).toBeDefined();
    expect(createdUser).toBeInstanceOf(User);
    expect(createdUser.phone).toEqual(user.phone);
    expect(createdUser.firstName).toEqual(user.firstName);
    expect(createdUser.lastName).toEqual(user.lastName);
    expect(createdUser.type).toEqual(user.type);
  });

  it('get by phone', async () => {
    const user = userBasicStub();
    const createdUser = await usersService.registerUser(user);
    const foundUser = await usersService.getByPhone(user.phone);
    const notfoundUser = await usersService.getByPhone(user.phone + '1');
    expect(foundUser).toBeInstanceOf(User);
    expect(notfoundUser).toBeNull();
    expect(foundUser).toEqual(createdUser);
  });

  it('get by id', async () => {
    const user = userBasicStub();
    const createdUser = await usersService.registerUser(user);
    const foundUser = await usersService.getById(user._id.toString());
    expect(foundUser).toBeInstanceOf(User);
    expect(foundUser).toEqual(createdUser);
  });

  describe('get users with pagination', () => {
    let savedUsers: User[] = [];
    beforeEach(async () => {
      savedUsers = [];
      for (let i = 0; i < 10; i++) {
        savedUsers.push(await usersService.registerUser(userBasicStub()));
      }
    });
    it('should return 10 users', async () => {
      const users = await usersService.getUsersByPage();
      expect(users).toBeDefined();
      expect(users.data.length).toEqual(10);
    });
    it('should return 5 users', async () => {
      const users = await usersService.getUsersByPage({ page: 1, limit: 5 });
      expect(users).toBeDefined();
      expect(users.data.length).toEqual(5);
      expect(users.meta.current_page).toEqual(1);
      expect(users.meta.total).toEqual(10);
      expect(users.meta.per_page).toEqual(5);
      expect(users.data[0]).toEqual(savedUsers[0]);
    });
    it('should return 5 users, page 2', async () => {
      const users = await usersService.getUsersByPage({ page: 2, limit: 5 });
      expect(users).toBeDefined();
      expect(users.data.length).toEqual(5);
      expect(users.meta.current_page).toEqual(2);
      expect(users.meta.total).toEqual(10);
      expect(users.meta.per_page).toEqual(5);
      expect(users.data[0]).toEqual(savedUsers[0 + 5]);
    });
    it('should rout of bound limit', async () => {
      const users = await usersService.getUsersByPage({ page: 10, limit: 10 });
      expect(users).toBeDefined();
      expect(users.data.length).toEqual(0);
    });
  });
});
