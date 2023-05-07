import type z from 'zod';
import { useEffect, useId } from 'react';
import { Link, useNavigate, useNavigation } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  IconSun,
  IconMoon,
  IconUpload,
  IconWaveSawTool,
  IconBrandGithub,
} from '@tabler/icons-react';

import { SearchSchema } from '~/schemas/search';
import { useDataTheme } from '../providers';

export type SidebarProps = {
  drawerToggleId?: string | undefined;
  drawerOpened: boolean;
  toggleDrawer: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  drawerToggleId,
  drawerOpened,
  toggleDrawer,
}) => {
  const navigate = useNavigate();
  const { state: navigationState } = useNavigation();
  const [theme, setTheme] = useDataTheme();
  const themeToggleId = useId();

  useEffect(() => {
    if (navigationState !== 'loading' && drawerOpened) {
      toggleDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationState, drawerOpened]);

  const { register, handleSubmit } = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    reValidateMode: 'onBlur',
  });

  const onSubmit = handleSubmit(({ search }) => navigate(`/track/${search}`));
  const toggleTheme: React.ChangeEventHandler<HTMLInputElement> = _ => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <>
      <label
        htmlFor={drawerToggleId}
        className='drawer-overlay'
      ></label>

      <ul className='menu p-4 w-80 bg-base-100'>
        <li className='mb-8'>
          <Link
            className='btn btn-ghost normal-case'
            to='/'
          >
            <IconWaveSawTool />
            <h2 className='text-lg'>transient</h2>
          </Link>
        </li>

        <li>
          <Link
            className='btn btn-ghost normal-case'
            to='/upload'
          >
            <IconUpload />
            Upload
          </Link>
        </li>

        <li>
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
        </li>

        <li className='flex-1 bg-base-100' />

        <li>
          <label
            className='mx-auto'
            htmlFor={themeToggleId}
          >
            {theme === 'light' ? (
              <IconSun size='16px' />
            ) : (
              <IconMoon size='16px' />
            )}
            <input
              id={themeToggleId}
              type='checkbox'
              className='toggle toggle-xs'
              onChange={toggleTheme}
            />
          </label>
        </li>

        <li>
          <a
            className='btn btn-ghost normal-case'
            href='https://github.com/bdreece/transient'
            rel='noreferrer'
            target='_blank'
          >
            <IconBrandGithub />
            Github
          </a>
        </li>
      </ul>
    </>
  );
};
