import crypto from "crypto";
import dotenv from "dotenv";
import { getUserByEmail } from "../users/user.service";
import { UserModel, Users } from "../users/user.model";
import { transporter } from "../../config/mails";
import { resetPasswordEmailTemplate } from "../../config/mails/reset-password-email-template";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "rest-api-errors";
import { User } from "../../types/custom";

dotenv.config();
export const generateResetPasswordToken = async () => {
  const token = crypto.randomBytes(20).toString("hex");

  const expiryDate =
    Date.now() + (Number(process.env.RESET_PASSWORD_TOKEN_EXPIRY) || 3600000); // as a default 1 hour
  return {
    token,
    expiryDate,
  };
};

export const verifyResetPasswordToken = (user: UserModel, token: string) => {
  if (user.resetPasswordToken !== token) {
    return false;
  }
  if (
    user.resetPasswordTokenExpiry &&
    user.resetPasswordTokenExpiry.getTime() < Date.now()
  ) {
    return false;
  }
  return true;
};

export const sendResetPasswordEmail = async (
  user_email: string,
  url: string
) => {
  transporter.sendMail(
    resetPasswordEmailTemplate(user_email, url),
    (error, info) => {
      if (error) {
        console.error(error);
        throw new InternalServerError("Failed to send the email");
      }
    }
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  console.log(token, newPassword);
  const user = await Users.findOne({
    resetPasswordToken: token,
  });

  if (!user) {
    throw new NotFoundError("User with this token not found");
  }

  if (
    user.resetPasswordTokenExpiry &&
    user.resetPasswordTokenExpiry.getTime() < Date.now()
  ) {
    throw new BadRequestError("Token expired");
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiry = null;
  await user.save();

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await Users.findOne({ "email.address": email });

  if (!user) {
    throw new Error("User not found");
  }

  return new Promise<UserModel>((resolve, reject) => {
    user.comparePassword(
      password,
      (err: Error | null, isMatch: boolean | null) => {
        if (err) {
          reject(err);
        }
        if (!isMatch) {
          reject(new Error("Invalid password"));
        }
        resolve(user);
      }
    );
  });
};

