import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as json from 'koa-json';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'hello' };
  await next();
});

app.use(json());
app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
