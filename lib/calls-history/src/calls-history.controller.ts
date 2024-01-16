import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CallDtoPagination } from './dtos/CallDtoPagination';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';
import { CallsHistoryService } from './calls-history.service';
import { GetUser } from 'lib/authentification/decorator';
import { CallDto } from './dtos/CallDto';
import { AuthStrategyValidateResult } from 'lib/authentification/auth.strategy';
import { UsersService } from 'lib/users/src/users.service';
import { OnlyForRegisters } from 'lib/utils/decorators/OnlyForRegister';
import { OnlyForHelpers } from 'lib/utils/decorators/OnlyForHelpers';
import { OnlyForDependents } from 'lib/utils/decorators/OnlyForDependant';

const prefix = 'history';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForRegisters()
export class CallsHistoryController {
  constructor(private readonly callsHistoryService: CallsHistoryService, private readonly usersService: UsersService) {}

  @Get()
  @OnlyForDependents()
  @ApiOperation({ operationId: 'getMyCallHistory', summary: 'Get my call history' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ type: CallDtoPagination })
  async getMyCallHistory(@GetUser() user: AuthStrategyValidateResult, @Query() pagination: PaginationQueryDto) {
    const calls = await this.callsHistoryService.getCallsHistory(user.livLinkUser!.phone, pagination);
    const response = new CallDtoPagination(calls.data.map((obj) => CallDto.from(obj)));
    response.meta = calls.meta;
    return response;
  }

  @Get(':userId')
  @OnlyForHelpers()
  @ApiOperation({
    operationId: 'getDependentCallHistory',
    summary: 'Get a dependent call history. only Helper are allow to do that',
    description: `This endpoint is only for Helpers. Helpers can access to the call history of their dependents.\n
    The dependents need to have set the permission "calls-history:read" to the corresponding circle of the helper.`,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ type: CallDtoPagination })
  async getDependentCallHistory(
    @GetUser() user: AuthStrategyValidateResult,
    @Query() pagination: PaginationQueryDto,
    @Param('userId') userId: string,
  ) {
    const targetUser = await this.usersService.getById(userId);
    if (!targetUser) {
      throw new BadRequestException('User not found');
    }
    if (!(await this.callsHistoryService.hasAuthorizationToAccess(user.livLinkUser!, targetUser))) {
      throw new BadRequestException('You are not authorized to access this user calls history');
    }
    const calls = await this.callsHistoryService.getCallsHistory(targetUser.phone, pagination);
    const response = new CallDtoPagination(calls.data.map((obj) => CallDto.from(obj)));
    response.meta = calls.meta;
    return response;
  }

  @Post()
  @OnlyForDependents()
  @ApiBody({ type: [CallDto] })
  @ApiOperation({ operationId: 'addCalls', summary: 'add a set of call history' })
  @ApiBadRequestResponse({ description: 'The given set of call contains invalid calls dtos' })
  @ApiCreatedResponse()
  async addCalls(@GetUser() user: AuthStrategyValidateResult, @Body() calls: CallDto[]) {
    await this.callsHistoryService.addCalls(user.livLinkUser!, calls);
  }
}
