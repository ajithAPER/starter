import { StrictMode } from 'react';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';

import { App } from '@repo/template-app-root';

export function render(_url: string, _ssrManifest?: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <App />
    </StrictMode>,
    options
  )
};