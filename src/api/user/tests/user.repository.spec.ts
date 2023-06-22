import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UsersRepository } from '../user.repository';

describe('UserRepository', () => {
  let repository: UsersRepository;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository, { provide: getModelToken(User.name), useValue: Model }],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUserFromPhone check', async () => {
    expect(repository).toBeDefined();
    expect(mockUserModel).toBeDefined();

    let spy = jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    let user = await repository.getUserFromPhone('+33 6 66 66 66 66');
    expect(user).toBeNull();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ phone: '+33 6 66 66 66 66' });

    spy.mockRestore();

    spy = jest.spyOn(repository, 'findOne').mockResolvedValueOnce(new User() as UserDocument);
    user = await repository.getUserFromPhone('+33 6 66 66 66 66');
    expect(user).not.toBeNull();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ phone: '+33 6 66 66 66 66' });
  });
});
