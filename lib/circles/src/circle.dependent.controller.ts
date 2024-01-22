/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PeopleCircleResponseDto, PersonCircleDto } from './dtos/dependent/people-circle.response.dto';
import { GetUser } from '../../../lib/authentification/decorator';
import { SendCircleRequestRequestDto } from './dtos/dependent/send-circle-request.request.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'lib/users';
import { OnlyForDependents } from 'lib/utils/decorators/OnlyForDependant';
import { CirclesService } from './circles.service2';
import { AuthStrategyValidateResult } from 'lib/authentification/auth.strategy';

const prefix = 'dependent-circles';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForDependents()
@Controller(prefix)
export class CircleDependentController {
  constructor(private readonly circlesService: CirclesService, private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all people in my circles',
    operationId: 'getPeopleInMyCircles',
  })
  @ApiOkResponse({ type: PeopleCircleResponseDto, description: 'All people in my circles' })
  public async getPeopleInMyCircles(@GetUser() user: AuthStrategyValidateResult): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getUsersInCircle(user.livLinkUser!);
    return new PeopleCircleResponseDto(
      circlePeople.map((circlePerson) =>
        PersonCircleDto.from(circlePerson.id, circlePerson.phone, circlePerson.status, circlePerson.type),
      ),
    );
  }

  @Get('requests')
  @ApiOperation({
    summary: 'Get all my requests',
    operationId: 'getMyRequests',
  })
  @ApiOkResponse({ type: PeopleCircleResponseDto, description: 'All my requests' })
  public async getMyRequests(@GetUser() user: AuthStrategyValidateResult): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getUsersRequested(user.livLinkUser!);
    return new PeopleCircleResponseDto(
      circlePeople.map((circlePerson) =>
        PersonCircleDto.from(circlePerson.id, circlePerson.phone, circlePerson.status, circlePerson.type),
      ),
    );
  }

  @Post('requests')
  @ApiOperation({
    summary: 'Send a request to add a person in my circles',
    description: `This endpoint retrieves a list of users in the system.`,
    operationId: 'sendRequestToAddInCircle',
  })
  @ApiOkResponse({ description: 'Request sent' })
  public async sendRequestToAddInCircle(
    @GetUser() user: AuthStrategyValidateResult,
    @Body() dto: SendCircleRequestRequestDto,
  ): Promise<void> {
    await this.circlesService.addPersonToCircleHandler(user.livLinkUser!, dto.phone, dto.type);
  }
}
