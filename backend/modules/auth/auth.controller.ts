import { Express, Router, Request, Response } from "express";

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  validationPipe,
} from "../../utils/validation";
import { validationMiddleware } from "../../middlewares/validate";

const app: Router = Router();

import { userSchema } from "../users/user.model";
import passport from "passport";
import { json } from "body-parser";

import { createUser, getUser } from "../users/user.service";



class SignupDto {
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

class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

app.post(
  "/signup",
  validationMiddleware(SignupDto),
  async (req: Request, res: Response) => {
    try {
      const user = await createUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profile: {
          fullName: req.body.fullName,
          avatar: req.body.avatar,
          bio: req.body.bio,
        },
      });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

app.post(
  "/signin",
  validationMiddleware(SigninDto),
  (req: Request, res: Response, next) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: any, info: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        req.login(user, (err: Error | null) => {
          if (err) {
            return next(err);
          }
          return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email.address,
            profile: user.profile,
          });
        });
      }
    )(req, res, next);
  }
);





/* 
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: true,
    keepSessionInfo: true,
  }),
  (req, res) => {
    const user = {
      id: req.user?.id,
      username: req.user?.username,
      email: req.user?.email.address,
      avatar: req.user?.profile.avatar,
      fullName: req.user?.profile.fullName,
      bio: req.user?.profile.bio,
    };
    const redirectURL = `${
      process.env.FRONTEND_URL
    }/auth/redirect/?user=${encodeURIComponent(JSON.stringify(user))}`;
    res.redirect(redirectURL);
  }
); */


export default app;
