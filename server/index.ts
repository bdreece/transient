import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { remix } from './middlewares';
import { trpc } from './middlewares/trpc';
import { scheduleCleanup } from './services/cleanup';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _cleanupTask = scheduleCleanup();

const PORT = process.env.PORT || 3000;
const app = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1m' }));

app.use(compression());
app.use(morgan('tiny'));

app.use('/trpc', trpc);
app.all('*', remix);

app.listen(PORT, () => console.log(`Listening on :${PORT}`));
