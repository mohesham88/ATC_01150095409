import { Strategy } from "passport-local";
import { Users } from "../../users/user.model";
import { UserModel } from "../../users/user.model";
import passport from "passport";

export const localStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const user = await Users.findOne({ "email.address": email });

    if (!user) {
      return done(null, false, { message: "Incorrect email." });
    }

    user.comparePassword(
      password,
      (err: Error | null, isMatch: boolean | null) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      }
    );
  }
);

passport.use(localStrategy);

passport.serializeUser(function (user, cb) {
  // console.log(user);
  return cb(null, user);
});

passport.deserializeUser((user: Express.User, cb) => {
  cb(null, user);
});
