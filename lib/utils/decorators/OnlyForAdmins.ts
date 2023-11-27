import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GuardAdmin } from 'lib/authentification/guard';

export function OnlyForAdmins() {
  return applyDecorators(
    UseGuards(GuardAdmin),
    ApiUnauthorizedResponse({ description: 'invalid credentials or you are not an admin' }),
    ApiBearerAuth(),
  );
}
