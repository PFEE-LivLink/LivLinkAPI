import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GuardIfHelper } from 'lib/authentification/guard';

export function OnlyForHelpers() {
  return applyDecorators(
    UseGuards(GuardIfHelper),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}
