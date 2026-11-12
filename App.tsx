import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SmaranaSplash } from './src/components/SmaranaSplash';
import { initDatabase } from './src/db/database';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  configureNotifications,
  ensureNotificationPermissions,
} from './src/utils/notifications';

initDatabase();
configureNotifications();

export default function App() {
  useEffect(() => {
    void ensureNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="light" />
        <RootNavigator />
        <SmaranaSplash />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
