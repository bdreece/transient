import { createContext, useContext, useState } from 'react';

export type DataTheme = 'light' | 'dark';
export type DataThemeContext = readonly [
  DataTheme,
  React.Dispatch<React.SetStateAction<DataTheme>>,
];

const context = createContext<DataThemeContext | undefined>(undefined);
export const useDataTheme = () => useContext(context)!;

export type DataThemeProviderProps = React.PropsWithChildren & {
  initialTheme?: DataTheme;
};

export const DataThemeProvider: React.FC<DataThemeProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const state = useState(initialTheme);

  return <context.Provider value={state}>{children}</context.Provider>;
};
