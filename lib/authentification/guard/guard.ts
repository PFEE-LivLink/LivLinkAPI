/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { AuthStrategyValidateResult } from '../auth.strategy';

export class GuardUnRegistered extends FirebaseAuthGuard {
  handleRequest<TUser>(
    err: any,
    user: AuthStrategyValidateResult | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log(err);
    if (err) {
      throw new UnauthorizedException(err);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.livLinkUser !== null) {
      throw new UnauthorizedException('User already registered');
    }
    if (user.isAdministrator) {
      throw new UnauthorizedException('Administrator cannot register');
    }
    return user as TUser;
  }
}

export class GuardRegistered extends FirebaseAuthGuard {
  handleRequest<TUser>(
    err: any,
    user: AuthStrategyValidateResult | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err) {
      throw new UnauthorizedException(err);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.livLinkUser === null) {
      throw new UnauthorizedException('User not registered');
    }
    return user as TUser;
  }
}

export class GuardBoth extends GuardRegistered {
  handleRequest<TUser>(
    err: any,
    user: AuthStrategyValidateResult | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    return super.handleRequest(err, user, info, context, status);
  }
}

export class GuardIfHelper extends GuardRegistered {
  handleRequest<TUser>(
    err: any,
    user: AuthStrategyValidateResult | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    super.handleRequest(err, user, info, context, status);
    if (!user!.livLinkUser!.isHelper()) {
      throw new UnauthorizedException('User is not a helper');
    }
    return user as TUser;
  }
}

export class GuardIfDependent extends GuardRegistered {
  handleRequest<TUser>(
    err: any,
    user: AuthStrategyValidateResult | null,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    super.handleRequest(err, user, info, context, status);
    if (!user!.livLinkUser!.isDependent()) {
      throw new UnauthorizedException('User is not a dependent');
    }
    return user as TUser;
  }
}
