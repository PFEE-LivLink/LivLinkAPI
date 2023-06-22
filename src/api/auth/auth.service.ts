import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';
import { UsersRepository } from '../user/user.repository';
import { RegisterRequestDTO } from './dtos/resgister.request.dto';
import { RunOptions } from 'src/constants';
import { RunCommandOptions } from 'src/commands/run.command';
import { LoginRequestDTO } from './dtos/login.request.dto';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwt: JwtService,
    @Inject(RunOptions) private readonly options: RunCommandOptions,
  ) {}

  async register(registerDTO: RegisterRequestDTO): Promise<string> {
    const phone = registerDTO.phone;
    const user = await this.userRepository.getUserFromPhone(phone);

    if (user != null) throw new ForbiddenException('Phone already used.');

    const hashedPassword = await argon.hash(registerDTO.password);

    const newUser = await this.userRepository.create({
      phone: registerDTO.phone,
      passwordHash: hashedPassword,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName,
      type: registerDTO.type,
    });

    return await this.signToken(newUser.id, newUser.phone);
  }

  async login(loginDTO: LoginRequestDTO): Promise<string> {
    const user = await this.userRepository.getUserFromPhone(loginDTO.phone);
    if (user == null) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.passwordHash, loginDTO.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return await this.signToken(user._id, user.phone);
  }

  async signToken(userId: string, phone: string): Promise<string> {
    if (this.options.jwtSecret == null) throw new Error('JWT secret is not defined');

    const payload = {
      id: userId,
      phone,
    };

    const secretJwt = this.options.jwtSecret;
    return await this.jwt.signAsync(payload, { expiresIn: '365d', secret: secretJwt });
  }
}
