const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmitter = require('node:events');

class PostEmitter extends EventEmitter {}
const postEmitter = new PostEmitter();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let message;

router.get('/subscribe', async (ctx, next) => {
    await new Promise(resolve => {
        function handlerPostQueery(){
            postEmitter.removeListener('post', handlerPostQueery);
            resolve();
        }
        postEmitter.on('post', handlerPostQueery);
    })

    ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message !== undefined && ctx.request.body.message !== '') {
        message = ctx.request.body.message;
        postEmitter.emit('post');
        ctx.body = message;
    } else {
        ctx.status = 200;
    }
});

app.use(router.routes());

module.exports = app;
