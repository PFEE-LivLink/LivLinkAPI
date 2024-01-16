/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsLaterThanConstraint implements ValidatorConstraintInterface {
  validate(endDate: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return typeof endDate === 'object' && typeof relatedValue === 'object' && endDate > relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" should be later than "${args.constraints[0]}"`;
  }
}

export function IsLaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLaterThanConstraint,
    });
  };
}
