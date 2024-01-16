import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permissions.entity';
import { PermissionsService } from './permissions.service';
import { UsersModule } from 'lib/users';
import { CirclesModule } from 'lib/circles';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission]), UsersModule, CirclesModule],
  controllers: [],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
