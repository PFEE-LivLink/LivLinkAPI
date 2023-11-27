import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthStrategyValidateResult } from '../auth.strategy';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

export class GuardAdmin extends FirebaseAuthGuard {
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
    if (!user.isAdministrator) {
      throw new UnauthorizedException('Administrator only');
    }
    return user as TUser;
  }
}
