import type { ChangeHandler } from 'react-hook-form';

export type InputProps = {
  id?: string;
  name?: string;
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
  value?: string;
  className?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  readonly?: boolean | undefined;
};
