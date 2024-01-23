import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OnlyForHelpers } from 'lib/utils/decorators/OnlyForHelpers';
import { CirclesService } from './circles.service2';

const prefix = 'helper-circles';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForHelpers()
@Controller(prefix)
export class CircleHelperController {
  constructor(private readonly circlesService: CirclesService) {}

  // @Get('requests')
  // @ApiOperation({ operationId: 'getReceivedRequests', summary: 'Get all received requests' })
  // @ApiOkResponse({ type: [ReceivedRequestDto], description: 'All received requests' })
  // public async getReceivedRequests(@GetUser() user: AuthStrategyValidateResult): Promise<ReceivedRequestDto[]> {
  //   const requests = await this.circlesService.GetRequests(user.livLinkUser!);
  //   return requests.map((request) => ReceivedRequestDto.from(request.user, request.request));
  // }

  // @Post('requests/:requestId/accept')
  // @ApiOperation({ operationId: 'acceptRequest', summary: 'Accept a request' })
  // @ApiOkResponse({ description: 'Request accepted' })
  // @ApiBadRequestResponse({ description: 'Request not found' })
  // public async acceptRequest(
  //   @GetUser() user: AuthStrategyValidateResult,
  //   @Param('requestId') requestId: string,
  // ): Promise<void> {
  //   const success = await this.circlesService.acceptRequest(user.livLinkUser!, requestId);
  //   if (!success) {
  //     throw new BadRequestException('Request not found');
  //   }
  // }

  // @Post('requests/:requestId/refuse')
  // @ApiOperation({ operationId: 'refuseRequest', summary: 'Refuse a request' })
  // @ApiOkResponse({ description: 'Request refused' })
  // @ApiBadRequestResponse({ description: 'Request not found' })
  // public async refuseRequest(
  //   @GetUser() user: AuthStrategyValidateResult,
  //   @Param('requestId') requestId: string,
  // ): Promise<void> {
  //   const success = await this.circlesService.rejectRequest(user.livLinkUser!, requestId);
  //   if (!success) {
  //     throw new BadRequestException('Request not found');
  //   }
  // }

  // @Get('')
  // @ApiOperation({ operationId: 'getMyConnections', summary: 'Get all my connections' })
  // @ApiOkResponse({ type: ConnectionsCircleResponseDto })
  // public async getMyConnections(): Promise<ConnectionsCircleResponseDto> {
  //   return new ConnectionsCircleResponseDto([]);
  // }

  // @Delete('revoke')
  // @ApiOperation({ operationId: 'revokeMyConnection', summary: 'Revoke my connection' })
  // @ApiOkResponse({ type: RevokeConnectionCircleResponseDto })
  // public async revokeMyConnection(): Promise<RevokeConnectionCircleResponseDto> {
  //   return RevokeConnectionCircleResponseDto.from(ConnectionCircleDto.from('todo', 'Near'));
  // }
}
