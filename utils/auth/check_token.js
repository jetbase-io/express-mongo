import Token from '../../models/token';
import errors from '../errors';
import logger from '../logger';

const checkToken = (req, res, next) => {
  Token.countDocuments({ value: req.headers.authorization.split(' ')[1] })
    .then((count) => {
      if (count > 0) {
        res.status(401).send(errors('Token is expired'));
      } else {
        next();
      }
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports = checkToken;
