import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CirclesService } from './circle.service';
import { UsersInfosService } from '../user/user-infos.service';
import { JwtGuardIfHelper } from '../authentification/guard';
import {
  RequestsCircleResponseDto,
  RequestCircleHandleResponseDto,
  RequestCircleDto,
  ConnectionsCircleResponseDto,
  RevokeConnectionCircleResponseDto,
  ConnectionCircleDto,
} from './dtos/helper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Helper Circles')
@Controller('helper/circles')
@UseGuards(JwtGuardIfHelper)
export class CircleHelperController {
  constructor(private readonly circlesService: CirclesService, private readonly usersInfoService: UsersInfosService) {}

  @Get('requests')
  public async getRequests(): Promise<RequestsCircleResponseDto> {
    return new RequestsCircleResponseDto([]);
  }

  @Post('requests/:requestId/accept')
  public async acceptRequest(): Promise<RequestCircleHandleResponseDto> {
    return RequestCircleHandleResponseDto.from(true, RequestCircleDto.from('todo', 'todo', 'high'));
  }

  @Post('requests/:requestId/refuse')
  public async refuseRequest(): Promise<RequestCircleHandleResponseDto> {
    return RequestCircleHandleResponseDto.from(false, RequestCircleDto.from('todo', 'todo', 'high'));
  }

  @Get('')
  public async getMyConnections(): Promise<ConnectionsCircleResponseDto> {
    return new ConnectionsCircleResponseDto([]);
  }

  @Delete('revoke')
  public async revokeMyConnection(): Promise<RevokeConnectionCircleResponseDto> {
    return RevokeConnectionCircleResponseDto.from(ConnectionCircleDto.from('todo', 'high'));
  }
}
