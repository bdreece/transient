import type { InputProps } from '~/types/input';
import { forwardRef } from 'react';

export type TextAreaProps = InputProps;

// eslint-disable-next-line react/display-name
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`textarea textarea-bordered ${className}`}
      {...props}
    ></textarea>
  ),
);
