import type z from 'zod';

import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@remix-run/react';

import {
  IconBrandGithub,
  IconMenu2,
  IconMoon,
  IconSun,
  IconUpload,
  IconWaveSawTool,
} from '@tabler/icons-react';

import { SearchSchema } from '~/schemas/search';
import { useDataTheme } from '../providers';

export type HeaderProps = {
  drawerToggleId?: string | undefined;
};

export const Header: React.FC<HeaderProps> = ({ drawerToggleId }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useDataTheme();
  const themeToggleId = useId();
  const { register, handleSubmit } = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    reValidateMode: 'onBlur',
  });

  const onSubmit = handleSubmit(({ search }) => {
    navigate(`/track/${search}`);
  });

  const toggleTheme: React.ChangeEventHandler<HTMLInputElement> = _ => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-none md:hidden'>
        <label
          className='btn btn-square btn-ghost'
          htmlFor={drawerToggleId}
        >
          <IconMenu2 />
        </label>
      </div>

      <div className='flex-1'>
        <Link
          className='btn btn-ghost normal-case text-xl flex gap-2'
          to='/'
        >
          <IconWaveSawTool />
          <h1>transient</h1>
        </Link>
      </div>

      <div className='flex-none gap-2 hidden md:flex'>
        <Link
          className='btn btn-ghost normal-case flex gap-2'
          to='/upload'
        >
          <IconUpload />
          Upload
        </Link>

        <form
          className='form-control'
          onSubmit={onSubmit}
        >
          <input
            type='text'
            placeholder='Search'
            autoComplete='on'
            className='input input-bordered'
            {...register('search')}
          />
        </form>

        <div className='form-control gap-2 px-4'>
          <label
            htmlFor={themeToggleId}
            className='mx-auto'
          >
            {theme === 'light' ? (
              <IconSun
                size='16px'
                className='mx-auto'
              />
            ) : (
              <IconMoon
                size='16px'
                className='mx-auto'
              />
            )}
          </label>
          <input
            id={themeToggleId}
            type='checkbox'
            className='toggle toggle-xs'
            onChange={toggleTheme}
          />
        </div>

        <div className='form-control'>
          <a
            className='btn btn-square btn-ghost'
            href='https://github.com/bdreece/transient'
            rel='noreferrer'
            target='_blank'
          >
            <IconBrandGithub />
          </a>
        </div>
      </div>
    </div>
  );
};
