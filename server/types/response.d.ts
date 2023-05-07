export type Response<TData = unknown, TError = string> =
  | TData
  | {
      error: TError;
    };
