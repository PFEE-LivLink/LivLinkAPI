/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PeopleCircleResponseDto, PersonCircleDto } from './dtos/dependent/people-circle.response.dto';
import { GetUser } from '../../../lib/authentification/decorator';
import { SendCircleRequestRequestDto } from './dtos/dependent/send-circle-request.request.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'lib/users';
import { User } from 'lib/users/src/entities/user.entity';
import { OnlyForDependents } from 'lib/utils/decorators/OnlyForDependant';
import { CirclesService } from './circles.service2';

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
  @ApiOkResponse({ type: PeopleCircleResponseDto })
  public async getPeopleInMyCircles(@GetUser() dependent: User): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getUsersInCircle(dependent);
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
  @ApiOkResponse({ type: PeopleCircleResponseDto })
  public async getMyRequests(@GetUser() dependent: User): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getUsersRequested(dependent);
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
  public async sendRequestToAddInCircle(
    @GetUser() dependent: User,
    @Body() dto: SendCircleRequestRequestDto,
  ): Promise<void> {
    await this.circlesService.addPersonToCircleHandler(dependent, dto.phone, dto.type);
  }
}
