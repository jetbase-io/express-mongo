import dotenv from 'dotenv';

import passport from 'passport';
import passportJWT from 'passport-jwt';
import abilities from '../abilities';
import errors from '../errors';
import User from '../../models/user';

dotenv.config();

const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTstrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
  try {
    const { user } = token;
    return User.findOne({ _id: user._id })
      .then((u) => {
        const found = u;
        if (found) {
          found.ability = abilities[found.role] || abilities.common;
        }
        return done(null, found);
      });
  } catch (error) {
    return done(null, false, errors(error));
  }
}));
