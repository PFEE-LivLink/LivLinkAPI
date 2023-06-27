import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './user.repository';
import { UserService } from './user.service';
import { UsersInfosService } from './user-infos.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserModule],
  providers: [UserService, UsersRepository, UsersInfosService],
  exports: [UsersRepository, UsersInfosService, UserService],
})
export class UserModule {}
