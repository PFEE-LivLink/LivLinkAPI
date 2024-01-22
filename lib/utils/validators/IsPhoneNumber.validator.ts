import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments | undefined): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return isValidPhoneNumber(value);
  }

  defaultMessage?(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} must be a valid french phone number`;
  }
}

export function IsPhoneNumber(): PropertyDecorator {
  return Validate(IsPhoneNumberConstraint);
}
