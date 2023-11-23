import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnlyForRegisters } from 'lib/utils/decorators/OnlyForRegister';
import { AuthStrategyValidateResult } from 'lib/authentification/auth.strategy';
import { GetUser } from 'lib/authentification/decorator';
import { UserDto } from './dtos/UserDto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';

const prefix = 'users';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForRegisters()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ operationId: 'GetMe' })
  @ApiOkResponse({ type: UserDto })
  async getMyCallHistory(@GetUser() user: AuthStrategyValidateResult) {
    return plainToInstance(UserDto, user.livLinkUser!);
  }
}
