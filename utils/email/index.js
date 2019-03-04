import logger from '../logger';

const email = (data) => {
  if (!data.email) {
    return new Promise((reject) => {
      const err = 'Missing data.email!';
      logger.error(err);
      reject(err);
    });
  }
  return new Promise(resolve => resolve());
};

module.exports = email;
