import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import compression from 'compression';
import cron from 'node-cron';

import logger from './utils/logger';
import checkToken from './utils/auth/check_token';
import authRoute from './routes/auth';
import logoutRoute from './routes/logout';
import usersRoute from './routes/users';
import cronTasks from './cron/tasks';
import './db';
import './utils/init';
import './utils/passport';
import './utils/auth';

const api = express();

api.use(bodyParser.urlencoded());
api.use(bodyParser.json());
api.use(cors());
api.use(compression());

api.use('/api/v1/login', authRoute);
api.use('/api/v1/logout', checkToken, passport.authenticate('jwt', { session: false }), logoutRoute);
api.use('/api/v1/users', checkToken, passport.authenticate('jwt', { session: false }), usersRoute);

api.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

api.listen(process.env.PORT, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info(
    `JetBase backend API express-mongo is now running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
  );
});

cron.schedule('*/5 * * * * *', cronTasks.clearTokens);

module.exports = api;
