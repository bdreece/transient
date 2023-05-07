export type ApiSuccessResult<TData> = {
  success: true;
  data: TData;
};

export type ApiErrorResult<TError> = {
  success: true;
  data: TError;
};

export type ApiResult<TData = undefined, TError = unknown> =
  | {
      success: false;
      error: TError;
    }
  | {
      success: true;
      data: TData;
    };
