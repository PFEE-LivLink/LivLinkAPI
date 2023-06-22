import EntityRepository from '../entity.repository';
import { Document, Model, FilterQuery, UpdateQuery, Query } from 'mongoose';

class EntityRepositoryMock extends EntityRepository<Document> {}

describe('EntityRepository', () => {
  let mockModel: Model<Document>;
  let mockEntity: Document;
  let mockQuery: Query<object, unknown>;
  let entityRepository: EntityRepository<Document>;

  beforeEach(() => {
    mockEntity = {
      save: jest.fn().mockResolvedValue({}),
    } as unknown as Document;

    mockQuery = {
      exec: jest.fn(),
    } as unknown as Query<object, unknown>;

    mockModel = {
      findOne: jest.fn().mockReturnValue(mockQuery),
      findById: jest.fn().mockReturnValue(mockQuery),
      find: jest.fn().mockReturnValue(mockQuery),
      create: jest.fn(),
      findOneAndUpdate: jest.fn().mockReturnValue(mockQuery),
      deleteMany: jest.fn().mockReturnValue(mockQuery),
      save: jest.fn(),
    } as unknown as Model<Document>;

    entityRepository = new EntityRepositoryMock(mockModel);
  });

  it('should call findOne with the provided entity filter query', async () => {
    const filterQuery: FilterQuery<Document> = { name: 'John' };
    await entityRepository.findOne(filterQuery);
    expect(mockModel.findOne).toHaveBeenCalledWith(filterQuery);
  });

  it('should call findById with an Id', async () => {
    const id: string = '123';
    await entityRepository.findById(id);
    expect(mockModel.findById).toHaveBeenCalledWith(id);
  });

  it('should call find with the provided entity filter query', async () => {
    const filterQuery: FilterQuery<Document> = { name: 'John' };
    await entityRepository.find(filterQuery);
    expect(mockModel.find).toHaveBeenCalledWith(filterQuery);
  });

  it('should call findOneAndUpdate with the provided entity filter query and update data', async () => {
    const filterQuery: FilterQuery<Document> = { _id: 'some-id' };
    const updateData: UpdateQuery<unknown> = { name: 'Updated Name' };
    await entityRepository.findOneAndUpdate(filterQuery, updateData);
    expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(filterQuery, updateData, { new: true });
  });

  it('should return true if deletedCount is greater than 0', async () => {
    const filterQuery: FilterQuery<Document> = { name: 'John' };
    const mockResult = { deletedCount: 1 };
    (mockQuery.exec as jest.Mock).mockResolvedValue(mockResult);
    const result = await entityRepository.deleteMany(filterQuery);
    expect(result).toBe(true);
  });

  it('should return false if deletedCount is 0', async () => {
    const filterQuery: FilterQuery<Document> = { name: 'John' };
    const mockResult = { deletedCount: 0 };
    (mockQuery.exec as jest.Mock).mockResolvedValue(mockResult);
    const result = await entityRepository.deleteMany(filterQuery);
    expect(result).toBe(false);
  });

  it('should call save on the provided entity', async () => {
    await entityRepository.save(mockEntity);
    expect(mockEntity.save).toHaveBeenCalled();
  });
});
