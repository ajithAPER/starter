import { resolve } from "path";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { All, Req, Res, Controller, Module } from "@nestjs/common";
import { Transform } from "stream";
import { readFileSync } from "fs";
import { jsx, jsxs } from "react/jsx-runtime";
import { lazy, Suspense, StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
const LazyComponent = lazy(() => import("./assets/lazy-comp-ByJ0w-1C.js"));
const LazyApp = () => {
  return /* @__PURE__ */ jsx(Suspense, { fallback: "loading", children: /* @__PURE__ */ jsx(LazyComponent, {}) });
};
const App = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Hello World" }),
    /* @__PURE__ */ jsx(LazyApp, {})
  ] });
};
function render(_url, _ssrManifest, options) {
  return renderToPipeableStream(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, {}) }),
    options
  );
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
const ABORT_DELAY = 1e4;
const TEMPLATE_HTML = readFileSync(resolve("dist/static/index.html"), "utf-8");
const SSR_MANIFEST = readFileSync("dist/static/.vite/ssr-manifest.json", "utf-8");
let AppController = class {
  getSSR(req, resp) {
    try {
      const url = req.originalUrl.replace("/", "");
      let didError = false;
      const { pipe, abort } = render(url, SSR_MANIFEST, {
        onShellError(e) {
          console.error(e);
          resp.status(500);
          resp.set({ "Content-Type": "text/html" });
          resp.send("<h1>Something went wrong</h1>");
        },
        onShellReady() {
          resp.status(didError ? 500 : 200);
          resp.set({ "Content-Type": "text/html" });
          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              resp.write(chunk, encoding);
              callback();
            }
          });
          const [htmlStart, htmlEnd] = TEMPLATE_HTML.split(`<!--app-html-->`);
          resp.write(htmlStart);
          transformStream.on("finish", () => {
            resp.end(htmlEnd);
          });
          pipe(transformStream);
        },
        onError(error) {
          didError = true;
          console.error(error);
        }
      });
      setTimeout(() => {
        abort();
      }, ABORT_DELAY);
    } catch (e) {
      console.log(e.stack);
      resp.status(500).end(e.stack);
    }
  }
};
__decorateClass$1([
  All("*"),
  __decorateParam(0, Req()),
  __decorateParam(1, Res())
], AppController.prototype, "getSSR", 1);
AppController = __decorateClass$1([
  Controller()
], AppController);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
let AppModule = class {
};
AppModule = __decorateClass([
  Module({
    imports: [],
    controllers: [
      AppController
    ],
    providers: []
  })
], AppModule);
const viteNodeApp = NestFactory.create(
  AppModule,
  new ExpressAdapter()
).then((app) => {
  app.useStaticAssets(resolve("./dist/static/assets"), {
    prefix: "/assets/"
  });
  return app;
});
{
  (async () => {
    await (await viteNodeApp).listen(3e3);
  })();
}
export {
  viteNodeApp
};
