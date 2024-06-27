import {
  StrictMode
} from 'react';
import { hydrateRoot } from 'react-dom/client';

import { App } from '@repo/template-app-root';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <App />
  </StrictMode>
);