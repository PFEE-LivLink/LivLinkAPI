import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) UserModel: Model<UserDocument>) {
    super(UserModel);
  }

  async getUserFromPhone(phone: string): Promise<User | null> {
    return await this.findOne({ phone });
  }
}
