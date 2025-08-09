import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import '../global.css';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="setup/welcome" options={{ headerShown: false }} />
          <Stack.Screen name="setup/company" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="forms/person" options={{ headerShown: false }} />
          <Stack.Screen name="forms/activity" options={{ headerShown: false }} />
          <Stack.Screen name="forms/company" options={{ headerShown: false }} />
          <Stack.Screen name="details/person/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="details/activity/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}