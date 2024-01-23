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
class IsDifferentThanConstraint implements ValidatorConstraintInterface {
  validate(otherValue: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return otherValue !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" should be different than "${args.constraints[0]}"`;
  }
}

export function IsDifferentThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsDifferentThanConstraint,
    });
  };
}
