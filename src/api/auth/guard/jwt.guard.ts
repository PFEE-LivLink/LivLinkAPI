/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw new Error('TODO'); // TODO
    }
    return user;
  }
}
