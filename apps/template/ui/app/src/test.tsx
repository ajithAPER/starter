import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./lazy-comp'));

export const LazyApp = () => {
  return (
    <Suspense fallback={'loading'}>
      <LazyComponent />
    </Suspense>
  );
}