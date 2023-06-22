import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidNumberForRegion } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: false })
export class IsFrenchPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments | undefined): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return isValidNumberForRegion(value, 'FR');
  }

  defaultMessage?(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} must be a valid french phone number`;
  }
}

export function IsFrenchPhoneNumber(): PropertyDecorator {
  return Validate(IsFrenchPhoneNumberConstraint);
}
