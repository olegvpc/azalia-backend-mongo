const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllNumbers,
  createNumber,
} = require('../controllers/numbers');

router.get('/', getAllNumbers);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      number: Joi.string().required().min(1).max(10),
    }),
  }),
  createNumber,
);

module.exports = router;
