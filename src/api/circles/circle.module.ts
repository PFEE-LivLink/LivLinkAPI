import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CirclesRepository } from './circle.repository';
import { CirclesService } from './circle.service';
import { UserCircles, UserCirclesSchema } from './schemas/user-circles.schema';
import { UserModule } from '../user/user.module';
import { CircleHelperController } from './circle.helper.controller';
import { CircleDependentController } from './circle.dependent.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserCircles.name, schema: UserCirclesSchema }]), UserModule],
  providers: [CirclesRepository, CirclesService],
  controllers: [CircleHelperController, CircleDependentController],
  exports: [CirclesService],
})
export class CircleModule {}
