import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

type ThemeMode = 'light' | 'dark';

const OVERRIDE_KEY = 'funkfit:v1:themeOverride';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  colors: Colors.light,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  // null = follow the system; 'light'/'dark' = explicit user override.
  const [override, setOverride] = useState<ThemeMode | null>(null);

  // Restore any saved manual override on first mount.
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(OVERRIDE_KEY);
      if (saved === 'light' || saved === 'dark') setOverride(saved);
    })();
  }, []);

  const mode: ThemeMode = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setOverride(next);
    AsyncStorage.setItem(OVERRIDE_KEY, next);
  }, [mode]);

  const colors = Colors[mode] as ThemeColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
