const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');

const {
  PORT = 4000,
  BASE_PATH = `http://localhost:${PORT}`,
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/azalia');

app.use(limiter);
app.use(requestLogger); // логирование запросов
app.use(cors);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// тестирование на восстановление работы сервера
// Не забыть удалить этот код после проверки
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use(routes); // все end-points в index.js

app.use(errorLogger); // логирование ошибок после запросов
app.use(errors()); // обработчик ошибок celebrate

app.use(handleError);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
