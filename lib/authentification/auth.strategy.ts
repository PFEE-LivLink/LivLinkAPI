import { Injectable } from '@nestjs/common';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { User } from 'lib/users/src/schema/user.schema';
import { UsersService } from 'lib/users/src/users.service';

export interface AuthStrategyValidateResult {
  firebaseUser: any;
  livLinkUser: User | null;
}

@Injectable()
export class AuthStrategy extends FirebaseAuthStrategy {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(token: string): Promise<AuthStrategyValidateResult> {
    const firebaseUser: any = await super.validate(token);
    const livLinkUser = await this.usersService.getByPhone(firebaseUser.phone_number);
    return { firebaseUser, livLinkUser };
  }
}
