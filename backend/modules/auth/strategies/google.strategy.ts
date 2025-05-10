import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { UserModel, Users } from "../../users/user.model";

// http://localhost:3000/auth/google/redirect

passport.use(
  new Strategy(
    {
      clientID: String(process.env.CLIENT_ID),
      clientSecret: String(process.env.CLIENT_SECRET),
      callbackURL: `/api/v1/auth/google/redirect`,
      // callbackURL : `http://localhost:3005`,
      scope: ["email", "profile"],
      state: true,
      // passRequestToCallback : true
    },
    async (accessToken, refereshToken, profile, done) => {
      const user = await Users.findOne({
        $or: [
          { "google.id": profile.id },
          { "email.address": profile.emails?.[0].value },
        ],
      });

      if (user) {
        if (!user.google.id) {
          // account with email but no goole acount
          user.google.id = profile.id;
          user.google.token = accessToken;
          /* user.email.address = String(profile.emails?.[0].value);
      user.email.verified = Boolean(profile.emails?.[0].verified); */
          await user.save();
        }
        return done(null, user);
      } else {
        const newUser = new Users();
        newUser.username = profile.displayName;
        newUser.google.id = profile.id;
        newUser.google.token = accessToken;
        newUser.profile.avatar = String(profile.photos?.[0].value);
        newUser.email.address = String(profile.emails?.[0].value);
        newUser.email.verified = Boolean(profile.emails?.[0].verified);
        newUser.profile.fullName =
          profile.name?.givenName + " " + profile.name?.familyName;
        const newUserSaved = await newUser.save();
        if (!newUserSaved) {
          throw new Error(`Failed to save user to the database`);
        }

        return done(null, newUser);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  // console.log(user);
  return cb(null, user);
});

passport.deserializeUser((user: Express.User, cb) => {
  cb(null, user);
});
