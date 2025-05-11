
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  validationPipe,
} from "../../utils/validation";



export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword(
    {
      minSymbols: 0,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
    },
    {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }
  )
  @IsNotEmpty()
  password: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}




export class ResetPasswordDto {
  @IsStrongPassword(
    {
      minSymbols: 0,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
    },
    {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }
  )
  @IsNotEmpty()
  password: string;
}