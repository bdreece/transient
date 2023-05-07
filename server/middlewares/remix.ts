import type { RequestHandler } from 'express';
import { createRequestHandler } from '@remix-run/express';

import path from 'path';

const BUILD_DIR = path.join(process.cwd(), 'build');

const purgeRequireCache = () => {
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
};

export const remix: RequestHandler = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') purgeRequireCache();

  return createRequestHandler({
    build: require('../../build'),
    mode: process.env.NODE_ENV,
  })(req, res, next);
};
