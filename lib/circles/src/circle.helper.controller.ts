import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  RequestsCircleResponseDto,
  RequestCircleHandleResponseDto,
  RequestCircleDto,
  ConnectionsCircleResponseDto,
  RevokeConnectionCircleResponseDto,
  ConnectionCircleDto,
} from './dtos/helper';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CirclesService } from './circles.service';
import { UsersInfosService } from 'lib/users/src/user-infos.service';
import { OnlyForHelpers } from 'lib/utils/decorators/OnlyForHelpers';

const prefix = 'helper-circles';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForHelpers()
@Controller(prefix)
export class CircleHelperController {
  constructor(private readonly circlesService: CirclesService, private readonly usersInfoService: UsersInfosService) {}

  @Get('requests')
  @ApiOperation({ operationId: 'getReceivedRequests', summary: 'Get all received requests' })
  @ApiOkResponse({ type: RequestsCircleResponseDto })
  public async getReceivedRequests(): Promise<RequestsCircleResponseDto> {
    return new RequestsCircleResponseDto([]);
  }

  @Post('requests/:requestId/accept')
  @ApiOperation({ operationId: 'acceptRequest', summary: 'Accept a request' })
  @ApiOkResponse({ type: RequestCircleHandleResponseDto })
  public async acceptRequest(@Param('requestId') requestId: string): Promise<RequestCircleHandleResponseDto> {
    return RequestCircleHandleResponseDto.from(true, RequestCircleDto.from('todo', 'todo', 'high'));
  }

  @Post('requests/:requestId/refuse')
  @ApiOperation({ operationId: 'refuseRequest', summary: 'Refuse a request' })
  @ApiOkResponse({ type: RequestCircleHandleResponseDto })
  public async refuseRequest(@Param('requestId') requestId: string): Promise<RequestCircleHandleResponseDto> {
    return RequestCircleHandleResponseDto.from(false, RequestCircleDto.from('todo', 'todo', 'high'));
  }

  @Get('')
  @ApiOperation({ operationId: 'getMyConnections', summary: 'Get all my connections' })
  @ApiOkResponse({ type: ConnectionsCircleResponseDto })
  public async getMyConnections(): Promise<ConnectionsCircleResponseDto> {
    return new ConnectionsCircleResponseDto([]);
  }

  @Delete('revoke')
  @ApiOperation({ operationId: 'revokeMyConnection', summary: 'Revoke my connection' })
  @ApiOkResponse({ type: RevokeConnectionCircleResponseDto })
  public async revokeMyConnection(): Promise<RevokeConnectionCircleResponseDto> {
    return RevokeConnectionCircleResponseDto.from(ConnectionCircleDto.from('todo', 'high'));
  }
}