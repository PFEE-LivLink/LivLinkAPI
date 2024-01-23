import { Module } from '@nestjs/common';
import { CircleHelperController } from './circle.helper.controller';
import { CircleDependentController } from './circle.dependent.controller';
import { UsersModule } from 'lib/users';
import { CirclesService } from './circles.service2';
import { UserCircles } from './entities/userCircles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserCircles]), UsersModule],
  providers: [CirclesService],
  controllers: [CircleHelperController, CircleDependentController],
  exports: [CirclesService],
})
export class CirclesModule {}
