import type { InputProps } from '~/types/input';

import { forwardRef } from 'react';

export type TextInputProps = InputProps & {
  type?: React.HTMLInputTypeAttribute;
};

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type = 'text', placeholder = 'Type here', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`input input-bordered ${className ?? ''}`}
      {...props}
    />
  ),
);
