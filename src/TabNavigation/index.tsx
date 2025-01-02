import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import UserDashboardStack from './StackNavigator/UserDashboardStack';
import HomeStack from './StackNavigator/HomeStack';
import WineGroupStack from './StackNavigator/WineGroupStack';
import SVGComponent from '../assets/svg/SvgCodeFile/bottleTabIcon';
import SVGComponentWine from '../assets/svg/SvgCodeFile/WineIconTab';
import SVGComponentPerson from '../assets/svg/SvgCodeFile/PersoneTabIcon';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabNavigation: React.FC = () => {
  const { t } = useTranslation();
  const os = Platform.OS;

  return (
    <Tab.Navigator
      initialRouteName="UserDashboard"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#522F60',
        tabBarInactiveTintColor: '#E8E8E8',
        tabBarStyle: {
          backgroundColor: '#E8E8E8',
          height: 100,
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        name="UserDashboard"
        component={UserDashboardStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <SVGComponentWine
                style={{ width: 72, height: 72, marginTop: os === 'ios' ? 30 : 0 }}
              />
              <Text style={{ fontSize: 10, fontWeight: '300', color: '#808080' }}>
                {t('home')}
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <SVGComponent
                style={{ width: 72, height: 72, marginTop: os === 'ios' ? 30 : 0 }}
              />
            </View>
          ),
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="WineGroup"
        component={WineGroupStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <SVGComponentPerson
                style={{ width: 72, height: 72, marginTop: os === 'ios' ? 30 : 0 }}
              />
              <Text style={{ fontSize: 10, fontWeight: '300', color: '#808080' }}>
                {t('me')}
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
