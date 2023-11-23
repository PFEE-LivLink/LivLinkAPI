import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'lib/authentification/decorator';
import { AuthStrategyValidateResult } from './auth.strategy';
import { RegisterRequestDTO } from './dtos/resgister.request.dto';
import { UsersService } from 'lib/users/src/users.service';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'lib/users/src/dtos/UserDto';
import { OnlyForUnRegisters } from 'lib/utils/decorators/OnlyForUnRegister';

const prefix = 'auth';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForUnRegisters()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ operationId: 'register', summary: 'Register a new user' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ type: UserDto })
  async register(@GetUser() user: AuthStrategyValidateResult, @Body() body: RegisterRequestDTO) {
    const newUser = await this.usersService.registerUser({
      phone: user.firebaseUser.phone_number,
      firstName: body.firstName,
      lastName: body.lastName,
      type: body.type,
    });
    return plainToInstance(UserDto, newUser);
  }
}
