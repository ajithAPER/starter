import { resolve } from 'path';
import { Transform } from 'stream';
import { readFileSync } from 'fs';
import { All, Controller, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';

import { render } from './app.entry-server';

const ABORT_DELAY = 10000 as const;

const TEMPLATE_HTML = readFileSync(resolve('dist/static/index.html'), 'utf-8');
const SSR_MANIFEST = readFileSync('dist/static/.vite/ssr-manifest.json', 'utf-8');

@Controller()
export class AppController {
  @All('*')
  getSSR(@Req() req: Request, @Res() resp: Response) {
    try {
      const url = req.originalUrl.replace('/', '')

      let didError = false

      const { pipe, abort } = render(url, SSR_MANIFEST, {
        onShellError(e) {
          console.error(e);
          resp.status(500)
          resp.set({ 'Content-Type': 'text/html' })
          resp.send('<h1>Something went wrong</h1>')
        },
        onShellReady() {
          resp.status(didError ? 500 : 200)
          resp.set({ 'Content-Type': 'text/html' })

          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              resp.write(chunk, encoding)
              callback()
            }
          })

          const [htmlStart, htmlEnd] = TEMPLATE_HTML.split(`<!--app-html-->`)

          resp.write(htmlStart)

          transformStream.on('finish', () => {
            resp.end(htmlEnd)
          })

          pipe(transformStream)
        },
        onError(error) {
          didError = true
          console.error(error)
        }
      })

      setTimeout(() => {
        abort();
      }, ABORT_DELAY);
    } catch (e) {
      // vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      resp.status(500).end(e.stack)
    }
  }
}