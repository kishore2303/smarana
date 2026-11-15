import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
import { NityaPoojaModal } from '../components/NityaPoojaModal';
import { PanchangamModal } from '../components/PanchangamModal';
import { SmaranaLogo } from '../components/SmaranaLogo';
import { TabIcon } from '../components/TabIcon';
import { TopLanguageToggle } from '../components/TopLanguageToggle';
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
    isPanchangamOpen,
    openPanchangam,
    closePanchangam,
    isNityaPoojaOpen,
    openNityaPooja,
    closeNityaPooja,
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
          headerTitleAlign: 'left',
          headerTitle:
            route.name === 'Home'
              ? () => null
              : () => (
                  <Text style={styles.headerTitleText} numberOfLines={1}>
                    {tabTitles[route.name]}
                  </Text>
                ),
          headerLeft:
            route.name === 'Home'
              ? () => (
                  <View style={styles.headerBrandContainer}>
                    <SmaranaLogo variant="symbol" size={24} />
                    <Text style={styles.headerBrandText}>SMARANA</Text>
                  </View>
                )
              : () => (
                  <HeaderBackButton
                    onPress={() => navigation.navigate('Home')}
                    accessibilityLabel={t.common.backHome}
                  />
                ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TopLanguageToggle />
              <HamburgerMenuButton
                onPress={openMenu}
                accessibilityLabel={t.menu.menuTitle}
              />
            </View>
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
        onOpenNityaPooja={openNityaPooja}
        onOpenAshtothram={openAshtothram}
        onOpenMantraLibrary={openMantraLibrary}
        onOpenPanchangam={openPanchangam}
        onNavigateTab={(tab) => {
          navigationRef.navigate(tab);
        }}
      />

      {/* Global Nitya Pooja Modal */}
      <NityaPoojaModal
        visible={isNityaPoojaOpen}
        onClose={closeNityaPooja}
      />

      {/* Global Panchangam Modal */}
      <PanchangamModal
        visible={isPanchangamOpen}
        onClose={closePanchangam}
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

const styles = StyleSheet.create({
  headerBrandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 8,
  },
  headerBrandText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
  },
});
