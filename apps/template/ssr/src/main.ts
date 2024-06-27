import {resolve} from "path";
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';

export const viteNodeApp = NestFactory.create<NestExpressApplication>(
  AppModule,
  new ExpressAdapter()
).then((app) => {
  app.useStaticAssets(resolve('./dist/static/assets'), {
    prefix: '/assets/'
  });

  return app
});

// @ts-expect-error
if (import.meta.env.PROD) {
  (async () => {
    await (await viteNodeApp).listen(3000);
  })();
}