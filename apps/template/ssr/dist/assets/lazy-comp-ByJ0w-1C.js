import { jsx } from "react/jsx-runtime";
import { useRef, use } from "react";
const LazyHai = () => {
  const promise = useRef(new Promise((resolve) => {
    setTimeout(() => {
      resolve("hai");
    }, 1e3);
  }));
  use(promise.current);
  return /* @__PURE__ */ jsx("div", { children: "I am Lazy" });
};
export {
  LazyHai as default
};
