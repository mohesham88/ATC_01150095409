import { Express, Router, Request, Response } from "express";

import { validationMiddleware } from "../../middlewares/validate";

const app: Router = Router();

import { UserModel, userSchema } from "../users/user.model";
import passport from "passport";
import { json } from "body-parser";

import {
  createUser,
  loginUser,
  getUserByEmail,
  updateUser,
} from "../users/user.service";
import { BadRequestError, NotFoundError } from "rest-api-errors";
import {
  generateResetPasswordToken,
  resetPassword,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
} from "./auth.service";
import rateLimit from "express-rate-limit";

import { SignupDto, SigninDto, ResetPasswordDto } from "./auth.dto";


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

      res.status(201).json(user.toJSON());
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

app.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  const { token, expiryDate } = await generateResetPasswordToken();

  // update the user with the new token and expiry date
  const updatedUser = await updateUser(user.id, {
    resetPasswordToken: token,
    resetPasswordTokenExpiry: expiryDate,
  });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail(email, resetPasswordUrl);

  res.status(200).json({
    message: "Email sent successfully check your inbox to reset your password",
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 7, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});


app.post(
  "/reset-password/:token",
  limiter,
  validationMiddleware(ResetPasswordDto),
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const updatedUser = await resetPassword(token, password);

    res.status(200).json((updatedUser as UserModel).toJSON());
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
