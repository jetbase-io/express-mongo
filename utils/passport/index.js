import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../../models/user';
import errors from '../errors';

const LocalStrategy = passportLocal.Strategy;

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, errors('User not found'));
    }
    const validate = await user.isValidPassword(user, password);
    if (!validate) {
      return done(null, false, errors('Wrong Password'));
    }
    return done(null, user, errors('Logged in Successfully'));
  } catch (error) {
    return done(null, false, errors(error));
  }
}));
