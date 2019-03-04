import bcrypt from 'bcrypt';

import User from '../models/user';
import logger from '../utils/logger';
import errors from '../utils/errors';

exports.get = (req, res) => {
  User.findById(req.user)
    .then((user) => {
      const u = user;
      u.password = undefined;
      res.json(u);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(422).send(err.errors);
    });
};

exports.password = (req, res) => {
  try {
    const data = req.body || {};

    if (req.params.userId !== String(req.user._id)) {
      req.user.ability.throwUnlessCan('update', 'User');
    }

    User.findById(req.params.userId)
      .then(user => bcrypt.compare(data.oldpassword, user.password))
      .then((compare) => {
        if (compare && data.newpassword) {
          return User.findByIdAndUpdate(
            { _id: req.user._id },
            { password: data.newpassword },
            { new: true },
          );
        }
        return compare;
      })
      .then((compare) => {
        res.json({ result: compare });
      })
      .catch((err) => {
        logger.error(err);
        res.status(422).send(err.errors);
      });
  } catch (error) {
    res.status(403).send(errors(error.message));
  }
};
