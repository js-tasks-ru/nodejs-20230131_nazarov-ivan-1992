const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messageList = await Message.find({ chat: ctx.user});
  const messages = messageList.map(el => {
    return {
      date: el.date,
      id: el.id,
      text: el.text,
      user: el.user
    }
  })

  ctx.body = {messages};
};
