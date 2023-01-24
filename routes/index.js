const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const usersRoute = require('./users');
const messagesRoute = require('./messages');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/not-found-error');

const routes = express.Router();

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

routes.use('/users', usersRoute);
routes.use('/messages', auth, messagesRoute);
routes.use('*', (req, res, next) => {
  const err = new NotFoundError('Неверный адрес запроса');
  return next(err);
});

module.exports = { routes };
