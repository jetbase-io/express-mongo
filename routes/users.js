import express from 'express';
import Account from '../controllers/account';
import User from '../controllers/user';

const router = express.Router();

router.get('/', User.list);
router.get('/current', Account.get);
router.get('/:userId', User.get);
router.put('/:userId/password', Account.password);
router.put('/:userId', User.put);
router.post('/', User.post);
router.delete('/:userId', User.delete);

module.exports = router;
