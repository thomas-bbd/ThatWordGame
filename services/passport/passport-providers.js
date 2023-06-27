import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import {
  userDBVerification,
  idServerTokenValidation,
  githubUserDBInsert,
} from "./passport-network.js";
import GitHubStrategy from "passport-github2";
import passportCustom from "passport-custom";
import fs from "fs";
import dotenv from "dotenv";
const envFile = fs.readFileSync("config.env");
const envConfig = dotenv.parse(envFile);

for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

const CustomStrategy = passportCustom.Strategy;

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/oauth2/redirect/google",
      scope: ["profile"],
    },
    userDBVerification
  )
);

// passport.use(
//   "github",
//   new GitHubStrategy(
//     {
//       clientID: process.env["GITHUB_CLIENT_ID"],
//       clientSecret: process.env["GITHUB_CLIENT_SECRET"],
//       callbackURL: "/auth/oauth2/redirect/github",
//       scope: ["profile"],
//     },
//     function (accessToken, refreshToken, profile, done) {
//       githubUserDBInsert(profile, done);
//     }
//   )
// );

passport.use("idserver", new CustomStrategy(idServerTokenValidation));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
