import jwt from 'jsonwebtoken';
import passport from 'passport';
import permissions from '../utils/abilities/permissions';
import logger from '../utils/logger';
import Token from '../models/token';
import errors from '../utils/errors';

exports.login = (req, res, next) => {
  passport.authenticate('login', async (err, user, message) => {
    try {
      if (err || !user) {
        return res.status(400).json(message);
      }
      return req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email, role: user.role };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '30m' });
        return res.json({
          id: user.id, token, role: user.role, permissions: permissions[user.role],
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  Token.create({ value: token })
    .catch((err) => {
      logger.error(err);
    });
  res.status(200).send(errors('Logout successful'));
};
