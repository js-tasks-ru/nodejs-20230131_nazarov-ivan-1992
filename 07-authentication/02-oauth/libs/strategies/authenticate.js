const User = require('../../models/User');
const mongoose = require('mongoose');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, `Не указан email`);
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      let password = await User.schema.methods.generateSalt();

      user = new User({
        email,
        displayName
      });
      await user.setPassword(password);
      await user.save();
    }

    // mongoose.disconnect();
    return done(null, user);
  } catch (err) {
    done(err);
  }

  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
