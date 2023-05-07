import type { InputProps } from '~/types/input';

type OptionValue = string | number | readonly string[] | undefined;

export type SelectProps<TValue extends OptionValue> = Omit<
  InputProps,
  'onBlur' | 'onChange' | 'name'
> & {
  value?: TValue;
  options: (readonly [string, TValue])[];
  onChange: React.ReactEventHandler<HTMLSelectElement>;
};

export function Select<TValue extends OptionValue>({
  options,
  className,
  ...props
}: SelectProps<TValue>): React.ReactElement {
  return (
    <select
      className={`select select-bordered max-w-xs ${className}`}
      {...props}
    >
      {options.map(([key, value]) => (
        <option
          key={key}
          value={value}
        >
          {key}
        </option>
      ))}
    </select>
  );
}
