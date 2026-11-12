import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppMenuModal } from '../components/AppMenuModal';
import { AshtothramModal } from '../components/AshtothramModal';
import { HamburgerMenuButton } from '../components/HamburgerMenuButton';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { MantraLibraryModal } from '../components/MantraLibraryModal';
import { SmaranaHeaderTitle } from '../components/SmaranaHeaderTitle';
import { TabIcon } from '../components/TabIcon';
import { MenuProvider, useAppMenu } from './MenuContext';
import { getTabBarStyle } from './tabBarStyle';
import { RootTabParamList } from './types';
import { useLanguage } from '../i18n/LanguageContext';
import { HomeScreen } from '../screens/HomeScreen';
import { PradakshinaScreen } from '../screens/PradakshinaScreen';
import { JapaScreen } from '../screens/JapaScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

function InnerNavigator() {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const defaultTabBarStyle = getTabBarStyle(insets.bottom);
  const navigationRef = useNavigationContainerRef<RootTabParamList>();

  const {
    isMenuOpen,
    openMenu,
    closeMenu,
    isAshtothramOpen,
    openAshtothram,
    closeAshtothram,
    isMantraLibraryOpen,
    openMantraLibrary,
    closeMantraLibrary,
    startJapaWithAshtothram,
  } = useAppMenu();

  const tabTitles: Record<keyof RootTabParamList, string> = {
    Home: t.tabs.home,
    Pradakshina: t.tabs.pradakshina,
    Japa: t.tabs.japa,
    History: t.tabs.history,
    Settings: t.tabs.settings,
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.textPrimary,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <SmaranaHeaderTitle
              title={tabTitles[route.name]}
              isBrand={route.name === 'Home'}
            />
          ),
          headerLeft:
            route.name !== 'Home'
              ? () => (
                  <HeaderBackButton
                    onPress={() => navigation.navigate('Home')}
                    accessibilityLabel={t.common.backHome}
                  />
                )
              : undefined,
          headerRight: () => (
            <HamburgerMenuButton
              onPress={openMenu}
              accessibilityLabel={t.menu.menuTitle}
            />
          ),
          tabBarStyle: defaultTabBarStyle,
          tabBarActiveTintColor: colors.goldSoft,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIcon: ({ color }) => (
            <TabIcon name={route.name} color={color} size={24} />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t.tabs.home }}
        />
        <Tab.Screen
          name="Pradakshina"
          component={PradakshinaScreen}
          options={{ title: t.tabs.pradakshina }}
        />
        <Tab.Screen
          name="Japa"
          component={JapaScreen}
          options={{ title: t.tabs.japa }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: t.tabs.history }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t.tabs.settings }}
        />
      </Tab.Navigator>

      {/* Global App Hamburger Menu */}
      <AppMenuModal
        visible={isMenuOpen}
        onClose={closeMenu}
        onOpenAshtothram={openAshtothram}
        onOpenMantraLibrary={openMantraLibrary}
        onNavigateTab={(tab) => {
          navigationRef.navigate(tab);
        }}
      />

      {/* Global Ashtothram Modal */}
      <AshtothramModal
        visible={isAshtothramOpen}
        onClose={closeAshtothram}
        onSelectAshtothram={(ashtothram) => {
          startJapaWithAshtothram(ashtothram);
          navigationRef.navigate('Japa');
        }}
      />

      {/* Global Mantra Library Modal */}
      <MantraLibraryModal
        visible={isMantraLibraryOpen}
        onClose={closeMantraLibrary}
        onSelectMantra={(mantra) => {
          startJapaWithAshtothram(mantra);
          navigationRef.navigate('Japa');
        }}
        preferredScript={language === 'te' ? 'telugu' : 'sanskrit'}
        onChangeScript={() => {}}
      />
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return (
    <MenuProvider>
      <InnerNavigator />
    </MenuProvider>
  );
}
