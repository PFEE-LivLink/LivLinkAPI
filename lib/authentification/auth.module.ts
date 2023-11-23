import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy } from './auth.strategy';
import { UsersModule } from 'lib/users/src/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [AuthStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
