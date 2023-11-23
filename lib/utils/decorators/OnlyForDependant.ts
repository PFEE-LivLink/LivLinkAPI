import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GuardIfDependent } from 'lib/authentification/guard';

export function OnlyForDependents() {
  return applyDecorators(
    UseGuards(GuardIfDependent),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}
