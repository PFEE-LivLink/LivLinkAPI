import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthStrategyValidateResult } from 'lib/authentification/auth.strategy';
import { GetUser } from 'lib/authentification/decorator';
import { OnlyForRegisters } from 'lib/utils/decorators/OnlyForRegister';
import { PermissionsService } from '..';
import { PermissionsDto } from './dtos/permissionDto';
import { PermissionsRequestDto } from './dtos/permissionRequestDto';

const prefix = 'permissions';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
@OnlyForRegisters()
export class PermissionsController {
  constructor(private readonly permService: PermissionsService) {}

  @Get('me')
  @ApiOperation({ operationId: 'GetMyPermissions', summary: 'Get permissions for the authenticated user' })
  @ApiOkResponse({ type: PermissionsDto, description: "Successful response with the user's permissions" })
  async getMyPermissions(@GetUser() user: AuthStrategyValidateResult) {
    const perms = await this.permService.getMyPermissions(user.livLinkUser!.phone);
    return plainToInstance(PermissionsDto, perms);
  }

  @Post('me')
  @ApiOperation({ operationId: 'SetMyPermissions', summary: 'Set permissions for the authenticated user' })
  @ApiOkResponse({ description: 'Successful response with the user permissions' })
  async setMyPermissions(@GetUser() user: AuthStrategyValidateResult, @Body() perms: PermissionsRequestDto) {
    await this.permService.setPermission(user.livLinkUser!.phone, perms.circle, perms.key, perms.value ?? true);
  }
}
