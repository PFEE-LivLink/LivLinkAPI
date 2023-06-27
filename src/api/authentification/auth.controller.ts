import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dtos/resgister.request.dto';
import { LoginRequestDTO } from './dtos/login.request.dto';
import { TokenResponseDTO } from './dtos/token.response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() registerDto: RegisterRequestDTO): Promise<TokenResponseDTO> {
    const token = new TokenResponseDTO();
    token.access_token = await this.authService.register(registerDto);
    return token;
  }

  @Post('login')
  @HttpCode(200)
  public async login(@Body() loginDto: LoginRequestDTO): Promise<TokenResponseDTO> {
    const token = new TokenResponseDTO();
    token.access_token = await this.authService.login(loginDto);
    return token;
  }
}
