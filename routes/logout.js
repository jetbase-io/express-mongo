import express from 'express';
import Auth from '../controllers/auth';

const router = express.Router();

router.delete('/', Auth.logout);

module.exports = router;
