import { useId } from 'react';

export type FormControlProps = {
  label: string;
  error?: string | undefined;
  withAsterisk?: boolean | undefined;
  labelClassName?: string | undefined;
  children: (id: string) => React.ReactNode;
};

export const FormControl: React.FC<FormControlProps> = ({
  label,
  error,
  children,
  withAsterisk,
  labelClassName,
}) => {
  const id = useId();
  return (
    <div className='form-control w-full'>
      <label
        htmlFor={id}
        className='label'
      >
        <span className={`label-text ${labelClassName}`}>
          <>{label}</>
          <>{withAsterisk && <span className='text-secondary ml-2'>*</span>}</>
        </span>
        {error && <span className='label-text-alt'>{error}</span>}
      </label>
      {children(id)}
    </div>
  );
};
