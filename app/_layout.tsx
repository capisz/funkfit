import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { DataProvider } from '../contexts/DataContext';

function RootLayoutNav() {
  const { mode } = useTheme();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="why-changed" />
        <Stack.Screen name="food-log" />
        <Stack.Screen name="streak" />
        <Stack.Screen name="goal-hit" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="adjustment-popup" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        <Stack.Screen name="adjustment-down" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        <Stack.Screen name="first-day" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="notifications" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <DataProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </DataProvider>
  );
}
