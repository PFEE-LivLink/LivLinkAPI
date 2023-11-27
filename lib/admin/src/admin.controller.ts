import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategyValidateResult } from 'lib/authentification/auth.strategy';
import { GetUser } from 'lib/authentification/decorator';
import { CallsHistoryService } from 'lib/calls-history';
import { UsersService } from 'lib/users';
import { UserDto } from 'lib/users/src/dtos/UserDto';
import { UserDtoPagination } from 'lib/users/src/dtos/UserDtoPagination';
import { OnlyForAdmins } from 'lib/utils/decorators/OnlyForAdmins';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';

const prefix = 'admin';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForAdmins()
export class AdminController {
  constructor(private readonly callsHistoryService: CallsHistoryService, private readonly usersService: UsersService) {}

  @Get('admin-check')
  @ApiOperation({ summary: 'Check if the user is an admin', operationId: 'adminCheck' })
  @ApiOkResponse({ description: 'You are an admin' })
  async adminCheck() {
    return 'ok';
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users', operationId: 'getUsers' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'All users', type: UserDtoPagination })
  async getUsers(@Query() pagination: PaginationQueryDto) {
    const users = await this.usersService.findAll(pagination);
    const response = new UserDtoPagination(users.data.map((obj) => UserDto.from(obj)));
    response.meta = users.meta;
    return response;
  }
}
