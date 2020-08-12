import Token from '../../models/token';
import errors from '../errors';
import logger from '../logger';

const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send(errors('Unathorized'));
  }
  try {
    const count = await Token.countDocuments({ value: req.headers.authorization.split(' ')[1] });
    if (count > 0) {
      res.status(401).send(errors('Token is expired'));
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).send(errors('Unexpected internal errors'));
  }
};

module.exports = checkToken;
