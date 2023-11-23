import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GuardBoth } from 'lib/authentification/guard';

export function OnlyForRegisters() {
  return applyDecorators(
    UseGuards(GuardBoth),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}
