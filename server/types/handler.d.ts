import type { RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export type Handler<TResponse = unknown> = RequestHandler<
  ParamsDictionary,
  TResponse
>;
