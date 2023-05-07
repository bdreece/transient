import { ChangeEventHandler, forwardRef } from 'react';
import type { InputProps } from '~/types/input';

export type FileInputProps = Omit<InputProps, 'onChange'> & {
  accept?: string | undefined;
  multiple?: boolean | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

// eslint-disable-next-line react/display-name
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, ...props }, ref) => (
    <input
      type='file'
      ref={ref}
      className={`file-input file-input-bordered w-full ${className}`}
      {...props}
    />
  ),
);
