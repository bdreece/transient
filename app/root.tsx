import type { MetaFunction, LinksFunction } from '@remix-run/node';

import '@total-typescript/ts-reset';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useState } from 'react';
import { httpBatchLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Progressbar from 'remix-progressbar';

import trpc from '~/hooks/trpc';
import stylesheet from '~/styles/tailwind.css';
import { Layout } from './components';
import { DataThemeProvider } from './components/providers';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'transient',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Righteous&family=Work+Sans&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
];

const App: React.FC = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/trpc',
        }),
      ],
    }),
  );

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Progressbar
          color='hsl(var(--p))'
          showSpinner={false}
        />

        <DataThemeProvider>
          <trpc.Provider
            client={trpcClient}
            queryClient={queryClient}
          >
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Outlet />
              </Layout>
            </QueryClientProvider>
          </trpc.Provider>
        </DataThemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default App;
