const Number = require('../models/number');

const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getAllNumbers = (req, res, next) => {
  Number.find({})
    .sort({ createdAt: 'desc' })
    .then((numbers) => res.send(numbers))
    .catch(next); //  то же самое что .catch(err => next(err));
};

module.exports.createNumber = (req, res, next) => {
  const { number } = req.body;
  const ownerId = req.user._id;
  Number.create({ number, owner: ownerId })
    .then((result) => res.status(201).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError(`Переданы некорректные данные при записи цифры. - ${err.message}`);
        return next(error);
      }
      return next(err);
    });
};
