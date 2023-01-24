const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt для Хэширования пароля

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      select: false, // чтобы API не возвращал пароль
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (name, password) {
  return this.findOne({ name }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные данные пользователя-ИМЯ'));
      }

      return bcrypt.compare(password, user.password)
        // ВАЖНО - .then метода bcrypt.compare
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильный пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
