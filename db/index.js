import dotenv from 'dotenv';

import mongoose from 'mongoose';
import logger from '../utils/logger';

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connection
  .then((db) => {
    logger.info(`Successfully connected to ${process.env.DB_URL} MongoDB cluster in ${process.env.NODE_ENV} mode.`);
    return db;
  })
  .catch((err) => {
    if (err.message.code === 'ETIMEDOUT') {
      logger.info('Attempting to re-establish database connection.');
      mongoose.connect(process.env.DB_URL);
    } else {
      logger.error('Error while attempting to connect to database:');
      logger.error(err);
    }
  });

module.exports = connection;
