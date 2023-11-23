import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GuardUnRegistered } from 'lib/authentification/guard';

export function OnlyForUnRegisters() {
  return applyDecorators(
    UseGuards(GuardUnRegistered),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}
