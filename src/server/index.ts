import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import * as json from 'koa-json';
import Board from '../board';

const server = (board: Board) => {
  const app = new Koa();
  const router = new Router();

  router.get('/', async (ctx, next) => {
    ctx.body = 'Hello to EBB - Server';
    await next();
  });

  router.post('/home', async (ctx, next) => {
    await board.home();
    ctx.response.body = 'OK';
    await next();
  });

  router.post('/pen', async (ctx, next) => {
    const { state } = ctx.request.body;
    if (state) await board.raiseBrush();
    else await board.lowerBrush();
    await board.waitForEmptyQueue();
    ctx.response.body = 'OK';
    await next();
  });

  router.post('/move', async (ctx, next) => {
    const { path } = ctx.request.body;

    if (path) {
      await board.enableStepperMotors();

      for (const [x, y] of path) {
        await board.moveTo(x, y);
      }

      await board.waitForEmptyQueue();
      await board.disableStepperMotors();

      ctx.response.body = 'OK';
      await next();
    } else {
      ctx.response.status = 405;
    }
  });

  app.use(bodyParser());
  app.use(json());
  app.use(logger());
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};

export default server;
