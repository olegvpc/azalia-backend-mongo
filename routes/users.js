const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getCurrentUser,
  getUser,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.get('/', auth, getAllUsers);
router.get('/me', auth, getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().hex().length(24),
    }),
  }),
  auth,
  getUser,
);

module.exports = router;
