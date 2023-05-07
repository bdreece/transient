import { createExpressMiddleware } from '@trpc/server/adapters/express';

import router from '../router';

export const trpc = createExpressMiddleware({
  router,
  createContext: () => ({}),
});
