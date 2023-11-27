import { Injectable } from '@nestjs/common';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { User } from 'lib/users/src/schema/user.schema';
import { UsersService } from 'lib/users/src/users.service';

export interface AuthStrategyValidateResult {
  firebaseUser: any;
  livLinkUser: User | null;
  isAdministrator: boolean;
}

@Injectable()
export class AuthStrategy extends FirebaseAuthStrategy {
  private readonly admins: string[];
  constructor(private readonly usersService: UsersService) {
    super();
    this.admins = process.env.ADMIN_EMAILS?.split(',') ?? [];
  }

  async validate(token: string): Promise<AuthStrategyValidateResult> {
    const firebaseUser: any = await super.validate(token);
    if (firebaseUser === null) {
      return { firebaseUser: null, livLinkUser: null, isAdministrator: false };
    }
    if (this.admins.includes(firebaseUser.email)) {
      return { firebaseUser, livLinkUser: null, isAdministrator: true };
    }
    const livLinkUser = await this.usersService.getByPhone(firebaseUser.phone_number);
    return { firebaseUser, livLinkUser, isAdministrator: false };
  }
}
