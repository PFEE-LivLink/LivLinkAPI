/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CirclesService } from './circle.service';
import { JwtGuardIfDependent } from '../authentification/guard';
import {
  PeopleCircleResponseDto,
  PersonCircleDto,
  PersonCircleResponseDto,
} from './dtos/dependent/people-circle.response.dto';
import { GetUser } from '../authentification/decorator';
import { User } from '../user/schemas/user.schema';
import { FilterGetPeopleInMyCirclesDto, FilterGetRequestsDto } from './dtos/dependent/filters.dto';
import { SendCircleRequestRequestDto } from './dtos/dependent/send-circle-request.request.dto';
import { UserService } from '../user/user.service';
import { PersonPayloadDto } from '../user/dtos/person-payload.dto';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Dependent Circles')
@Controller('dependent/circles')
@UseGuards(JwtGuardIfDependent)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'You are not a dependent' })
export class CircleDependentController {
  constructor(private readonly circlesService: CirclesService, private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all people in my circles',
    description: 'You can filter by circle type.',
  })
  @ApiOkResponse({ type: PeopleCircleResponseDto })
  public async getPeopleInMyCircles(
    @GetUser() dependent: User,
    @Query() filters: FilterGetPeopleInMyCirclesDto,
  ): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getDependentUserCircles(
      dependent,
      filters.circle_type ? (ct) => ct === filters.circle_type : undefined,
      (status) => status === 'accepted',
    );
    const promises = circlePeople.map(async (circlePerson) => {
      const user = await this.usersService.getUserFromPhone(circlePerson.phone);
      let personPayload: PersonPayloadDto = PersonPayloadDto.fromUnknownPerson(circlePerson.phone);
      if (user !== null) {
        personPayload = PersonPayloadDto.fromRegisteredUser(user._id);
      }
      const responseDto = PersonCircleDto.from(
        circlePerson.id,
        personPayload,
        circlePerson.status,
        circlePerson.circleType,
      );
      return responseDto;
    });
    const circlePeopleDto = await Promise.all(promises);
    return new PeopleCircleResponseDto(circlePeopleDto);
  }

  @Get('requests')
  @ApiOperation({
    summary: 'Get all my requests',
    description:
      'By default this will also display the requests that have been rejected. You can filter by circle type and status.',
  })
  @ApiOkResponse({ type: PeopleCircleResponseDto })
  public async getMyRequests(
    @GetUser() dependent: User,
    @Query() filters: FilterGetRequestsDto,
  ): Promise<PeopleCircleResponseDto> {
    const circlePeople = await this.circlesService.getDependentUserCircles(
      dependent,
      filters.circle_type ? (ct) => ct === filters.circle_type : undefined,
      (status) => {
        if (status === 'accepted') {
          return false;
        }
        return filters.status ? status === filters.status : true;
      },
    );
    const promises = circlePeople.map(async (circlePerson) => {
      const user = await this.usersService.getUserFromPhone(circlePerson.phone);
      let personPayload: PersonPayloadDto = PersonPayloadDto.fromUnknownPerson(circlePerson.phone);
      if (user !== null) {
        personPayload = PersonPayloadDto.fromRegisteredUser(user._id);
      }
      const responseDto = PersonCircleDto.from(
        circlePerson.id,
        personPayload,
        circlePerson.status,
        circlePerson.circleType,
      );
      return responseDto;
    });
    const circlePeopleDto = await Promise.all(promises);
    return new PeopleCircleResponseDto(circlePeopleDto);
  }

  /*
  The requests are done using phone numbers,
    therefore the request is independent of the user's registration status.
    If the user who is the target of the request has previously accepted a request from the dependent,
it may automatically accept the request depending on the circumstances.
This operation has the capability to reissue a request that was previously rejected.
*/

  @Post('requests')
  @ApiOperation({
    summary: 'Send a request to add a person in my circles',
    description: `This endpoint retrieves a list of users in the system.\n**Markdown Example:**\n- First item\n- Second item\n- Third item`,
  })
  public async sendRequestToAddInCircle(
    @GetUser() dependent: User,
    @Body() dto: SendCircleRequestRequestDto,
  ): Promise<PersonCircleResponseDto> {
    const personCircleRaw = await this.circlesService.addPersonToCircleHandler(dependent, dto.phone, dto.circle_type);
    const user = await this.usersService.getUserFromPhone(dto.phone);
    let personPayload: PersonPayloadDto = PersonPayloadDto.fromUnknownPerson(personCircleRaw.phone);
    if (user !== null) {
      personPayload = PersonPayloadDto.fromRegisteredUser(user._id);
    }
    const responseDto = PersonCircleDto.from(
      personCircleRaw.id,
      personPayload,
      personCircleRaw.status,
      personCircleRaw.circleType,
    );
    return new PersonCircleResponseDto(responseDto);
  }
}
