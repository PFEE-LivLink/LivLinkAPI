import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCircles, UserCirclesSchema } from './schemas/user-circles.schema';
import { CirclesRepository } from './circles.repository';
import { CirclesService } from './circles.service';
import { CircleHelperController } from './circle.helper.controller';
import { CircleDependentController } from './circle.dependent.controller';
import { UsersModule } from 'lib/users';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserCircles.name, schema: UserCirclesSchema }]), UsersModule],
  providers: [CirclesRepository, CirclesService],
  controllers: [CircleHelperController, CircleDependentController],
  exports: [CirclesService],
})
export class CirclesModule {}
