import type { Router } from '@/router';

import { createTRPCReact } from '@trpc/react-query';

const trpc = createTRPCReact<Router>();

export default trpc;
