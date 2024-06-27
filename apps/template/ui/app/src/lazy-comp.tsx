"use server";
import {use, useRef} from 'react';

const LazyHai = () => {
  const promise = useRef(new Promise((resolve) => {
    setTimeout(() => {
      resolve('hai');
    }, 1000);
  }));

  use(promise.current);

  return (<div>
    I am Lazy
  </div>);
};

export default LazyHai;