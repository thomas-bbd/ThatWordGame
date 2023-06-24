import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import { userDBVerification } from "./passport-db.js";


passport.use(
    "google",
    new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/auth/oauth2/redirect/google',
    scope: [ 'profile' ]
  }, userDBVerification));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  

export default passport;