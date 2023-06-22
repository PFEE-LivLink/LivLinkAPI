import { Transform } from 'class-transformer';
import { isValidNumberForRegion, parsePhoneNumber } from 'libphonenumber-js';

export function TransformFrenchPhoneNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }
    if (isValidNumberForRegion(value, 'FR')) {
      return parsePhoneNumber(value, 'FR').formatInternational();
    }
    return value;
  });
}
