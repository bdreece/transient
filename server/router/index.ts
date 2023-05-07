import { mergeRouters } from './trpc';
import uploadRouter from './upload';

const router = mergeRouters(uploadRouter);

export type Router = typeof router;
export default router;
