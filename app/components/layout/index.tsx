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

      <div className='drawer-content flex flex-col'>
        <Header drawerToggleId={toggleId} />
        <main className='bg-base-200 flex-1'>{children}</main>
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
