const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const connection = require('../../libs/connection');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      let user = await User.find({email: email});
      user = user[0];
      if (!user) {
        done(null, false, 'Нет такого пользователя')
        return
      }
      user.schema.methods.salt = user.salt;
      user.schema.methods.passwordHash = user.passwordHash;

      let checkPassword = await User.schema.methods.checkPassword(password);

      if (!checkPassword){
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, user);
    },
);
