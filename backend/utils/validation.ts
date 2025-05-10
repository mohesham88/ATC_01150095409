import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export * from 'class-validator';

/**
 * @returns {ValidationError[] | null} - returns an array of validation errors if any or null if no errors
 */
export const validationPipe = async(schema : new () => {} , requestObject : object) => {
  const transforedClass : any = plainToInstance(schema , requestObject);

  const errors = await validate(transforedClass);

  if(errors.length > 0){
    return errors;
  }
  return null;
}