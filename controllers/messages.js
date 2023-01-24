const Message = require('../models/message');

const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getAllMessages = (req, res, next) => {
  Message.find({})
    // .populate(['owner', 'likes'])
    .sort({ createdAt: 'desc' })
    .then((messages) => res.send(messages))
    .catch(next); //  то же самое что .catch(err => next(err));
};

module.exports.createMessage = (req, res, next) => {
  const { text, author } = req.body;
  const ownerId = req.user._id;
  Message.create({ text, author, owner: ownerId })
    .then((message) => res.status(201).send(message))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError(`Переданы некорректные данные при создании сообщения. - ${err.message}`);
        return next(error);
      }
      return next(err);
    });
};

module.exports.deleteMessage = (req, res, next) => {
  Message.findById(req.params.messageId)
    .then((message) => {
      if (!message) {
        throw new NotFoundError(`Сообщение с указанным _id: ${req.params.messageId} не найдено.`);
      }
      if (message.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужое сообщение');
      }
      Message.findByIdAndRemove(req.params.messageId)
      // .populate('owner')
        .then(() => {
          res.send({ message: ` Сообщение с _id: ${req.params.messageId} удалено` });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.messageId} сообщения. ${err.name}`);
        return next(error);
      }
      return next(err);
    });
};
