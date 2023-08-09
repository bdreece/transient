import type { DataTheme } from '../providers/DataThemeProvider';

import { useEffect, useId, useRef, useState } from 'react';
import { useDataTheme } from '../providers';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export type LayoutProps = React.PropsWithChildren;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const toggleId = useId();
  const toggle = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useDataTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);

  const toggleDrawer = () => {
    if (toggle.current) {
      toggle.current.checked = !toggle.current.checked;
    }
  };

  useEffect(() => {
    if (!themeLoaded) {
      const t = (localStorage.getItem('theme') ?? undefined) as
        | DataTheme
        | undefined;

      if (t) {
        setTheme(t);
      }

      setThemeLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='drawer'
      data-theme={theme}
    >
      <input
        className='drawer-toggle'
        ref={toggle}
        id={toggleId}
        type='checkbox'
      />

      <div className='drawer-content flex flex-col z-10'>
        <Header drawerToggleId={toggleId} />
        <main className='bg-base-200 relative flex-1'>
          <section className='relative z-10'>{children}</section>

          <div className='absolute w-full bottom-0 z-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1440 320'
            >
              <path
                fill='hsl(var(--p))'
                fillOpacity='0.2'
                d='M0,128L84.7,192L169.4,128L254.1,224L338.8,192L423.5,192L508.2,256L592.9,288L677.6,256L762.4,160L847.1,192L931.8,224L1016.5,192L1101.2,288L1185.9,0L1270.6,32L1355.3,64L1440,288L1440,320L1355.3,320L1270.6,320L1185.9,320L1101.2,320L1016.5,320L931.8,320L847.1,320L762.4,320L677.6,320L592.9,320L508.2,320L423.5,320L338.8,320L254.1,320L169.4,320L84.7,320L0,320Z'
              ></path>
            </svg>
          </div>
        </main>
        <Footer />
      </div>
      <div className='drawer-side'>
        <Sidebar
          toggleDrawer={toggleDrawer}
          drawerOpened={toggle.current?.checked ?? false}
          drawerToggleId={toggleId}
        />
      </div>
    </div>
  );
};
