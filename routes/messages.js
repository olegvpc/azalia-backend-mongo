const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllMessages,
  createMessage,
  deleteMessage,
} = require('../controllers/messages');

router.get('/', getAllMessages);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      text: Joi.string().required().min(2).max(150),
      author: Joi.string().required().min(2).max(30),
    }),
  }),
  createMessage,
);
router.delete(
  '/:messageId',
  celebrate({
    params: Joi.object().keys({
      messageId: Joi.string().alphanum().hex().length(24),
    }),
  }),
  deleteMessage,
);

module.exports = router;
