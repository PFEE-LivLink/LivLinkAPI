/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/api/user/schemas/user.schema';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: any, user: User | null, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw new UnauthorizedException('PAS LE DROIT AHAH'); // TODO
    }
    return user as any;
  }
}

export class JwtGuardIfHelper extends AuthGuard('jwt') {
  handleRequest<TUser>(err: any, user: User | null, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw new UnauthorizedException('PAS LE DROIT AHAH'); // TODO
    }
    if (!user.isHelper()) {
      throw new UnauthorizedException('PAS LE DROIT AHAH'); // TODO
    }
    return user as any;
  }
}

export class JwtGuardIfDependent extends AuthGuard('jwt') {
  handleRequest<TUser>(err: any, user: User | null, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw new UnauthorizedException('PAS LE DROIT AHAH'); // TODO
    }
    if (!user.isDependent()) {
      throw new UnauthorizedException('PAS LE DROIT AHAH'); // TODO
    }
    return user as any;
  }
}
