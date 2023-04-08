const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const { user } = require('../libs/connection');

module.exports.register = async (ctx, next) => {
    let u = await User.findOne({ email: ctx.request.body.email });

    if (u) {
        throw {
            status: 400,
            name: 'ValidationError',
            errors: {
                "email": { message: "Такой email уже существует" }
            }

        }
    }
    const token = uuid();

    u = new User({
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName,
        verificationToken: token
    });

    await u.setPassword(ctx.request.body.password);
    await u.save();

    const res = await sendMail({
        template: 'confirmation',
        locals: { token },
        to: ctx.request.body.email,
        subject: 'Подтвердите почту',
    });

    ctx.body = { status: 'ok' };
};

module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({
        verificationToken: ctx.request.body.verificationToken,
    });

    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    user.verificationToken = undefined;
    await user.save();

    const token = uuid();

    ctx.body = { token };
};
