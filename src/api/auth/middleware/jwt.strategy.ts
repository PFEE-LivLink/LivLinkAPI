import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/api/user/schemas/user.schema';
import { UsersRepository } from 'src/api/user/user.repository';
import { RunCommandOptions } from 'src/commands/run.command';
import { RunOptions } from 'src/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UsersRepository,
    @Inject(RunOptions) private readonly options: RunCommandOptions,
  ) {
    if (options.jwtSecret === undefined) {
      throw new Error('JWT secret is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: options.jwtSecret,
    });
  }

  public async validate(payload: { id: number; phone: string }): Promise<User | null> {
    return await this.userRepository.getUserFromPhone(payload.phone);
  }
}
