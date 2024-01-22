import { Injectable } from '@nestjs/common';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { User } from 'lib/users/src/entities/user.entity';
import { UsersService } from 'lib/users/src/users.service';
import { AppConfiguration, InjectAppConfig } from 'lib/config/utils-config/src';

export interface AuthStrategyValidateResult {
  firebaseUser: any;
  livLinkUser: User | null;
}

@Injectable()
export class AuthStrategy extends FirebaseAuthStrategy {
  constructor(
    private readonly usersService: UsersService,
    @InjectAppConfig() private readonly appConfig: AppConfiguration,
  ) {
    super();
  }

  async validate(token: string): Promise<AuthStrategyValidateResult> {
    const firebaseUser: any = await super.validate(token);
    if (firebaseUser === null) {
      return { firebaseUser: null, livLinkUser: null };
    }
    const livLinkUser = await this.usersService.getByPhone(firebaseUser.phone_number);
    return { firebaseUser, livLinkUser };
  }
}
