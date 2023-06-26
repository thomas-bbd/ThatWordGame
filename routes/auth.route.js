import passport from "passport";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Router } from "express";
import passportGoogle from "../services/passport/passport-providers.js";

const authRouter = Router()

authRouter.get('/login', function(req, res, next) {
  res.redirect('/');
});

authRouter.get('/images/logo.svg', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/images/logo.png'));
});

authRouter.get('/images/logo.svg', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/images/logo.png'));
});

authRouter.get('/css/style.css', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/css/style.css'));
});

authRouter.get('/login/federated/google', passport.authenticate('google'));

authRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/login',
  keepSessionInfo: true
}));

authRouter.get('/login/federated/github', passport.authenticate('github'));

authRouter.get('/oauth2/redirect/github', passport.authenticate('github', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/login',
  keepSessionInfo: true
}));

authRouter.get('/idserver/redirect/idserver', passport.authenticate('idserver', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/login',
  keepSessionInfo: true
  })
);

authRouter.get('/user', function(req, res, next) {
  if (req.user) {
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  } else {
    res.status(401).json({
      status: "unauthorized",
      message: "You are not logged in."
    });
  }
});

authRouter.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/home');
  });
});

export default authRouter;