import validator from 'validator';
import { ForbiddenError } from '@casl/ability';

import User from '../models/user';
import logger from '../utils/logger';
import errors from '../utils/errors';

exports.list = (req, res) => {
  const query = req.query || {};

  User.apiQuery(query)
    .select('first_name last_name email')
    .then((users) => {
      res.json({ data: users });
    })
    .catch((err) => {
      logger.error(err);
      res.status(404).send(err.errors);
    });
};

exports.get = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      const u = user;
      u.password = undefined;
      res.json({ data: u });
    })
    .catch((err) => {
      logger.error(err);
      res.status(404).send(errors('User not found'));
    });
};

exports.put = (req, res) => {
  const data = req.body || {};

  if (data.email && !validator.isEmail(data.email)) {
    return res.status(422).send(errors('Invalid email address'));
  }

  return User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (req.params.userId !== String(req.user._id)) {
        req.user.ability.throwUnlessCan('update', user);
      }
      user.set(req.body);
      return user.save();
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof ForbiddenError) {
        res.status(403).send(errors(error.message));
      } else {
        res.status(422).send(errors(error.message));
      }
    });
};

exports.post = (req, res) => {
  const data = Object.assign({}, req.body, { user: req.user.sub }) || {};
  try {
    req.user.ability.throwUnlessCan('create', 'User');
    User.create(data)
      .then((user) => {
        res.json({ data: user });
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send(err);
      });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      res.status(403).send(errors(error.message));
    }
  }
};

exports.delete = (req, res) => User.findOne({ _id: req.params.userId })
  .then((user) => {
    req.user.ability.throwUnlessCan('delete', user);
    user.set(req.body);
    return user.delete();
  })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((error) => {
    if (error instanceof ForbiddenError) {
      res.status(403).send(errors(error.message));
    }
  });
