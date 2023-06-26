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

@Controller('dependent/circles')
@UseGuards(JwtGuardIfDependent)
export class CircleDependentController {
  constructor(private readonly circlesService: CirclesService, private readonly usersService: UserService) {}

  @Get()
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

  @Post('requests')
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
