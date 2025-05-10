import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Types } from 'mongoose'; // This imports the ObjectId type from mongoose

@ValidatorConstraint({ async: false }) // Synchronous validator
class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  
  validate(objectId: any): boolean {
    // Check if the value is a valid MongoDB ObjectId
    return Types.ObjectId.isValid(objectId);
  }

  defaultMessage(): string {
    return 'The value is not a valid MongoDB ObjectId.';
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidObjectIdConstraint,
    });
  };
}
