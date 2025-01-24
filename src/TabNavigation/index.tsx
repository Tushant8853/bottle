import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, useNavigationState, Route } from '@react-navigation/native';

import UserDashboardStack from './StackNavigator/UserDashboardStack';
import HomeStack from './StackNavigator/HomeStack';
import WineGroupStack from './StackNavigator/WineGroupStack';
import SVGComponent from '../assets/svg/SvgCodeFile/bottleTabIcon';
import SVGComponentWine from '../assets/svg/SvgCodeFile/WineIconTab';
import SVGComponentPerson from '../assets/svg/SvgCodeFile/PersoneTabIcon';
import { RootStackParamList } from '../../src/TabNavigation/navigationTypes';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigation: React.FC = () => {
  const { t } = useTranslation();
  const os = Platform.OS;
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkPendingTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem('PENDING_TASKS');
        if (tasks) {
          const parsedTasks = JSON.parse(tasks);
          setPendingTasks(parsedTasks);
          if (parsedTasks.length > 0) {
            Alert.alert(
              t('pendingTasks'),
              `${t('youHavePhotos')} ${parsedTasks.length} ${t('photosInMemories')}`,
              [
                { text: t('doThisLater'), style: 'cancel' },
                {
                  text: t('yes'),
                  onPress: () => handlePendingTasks(parsedTasks),
                },
              ]
            );
          }
        }
      } catch (error) {
        console.error('Failed to retrieve pending tasks:', error);
      }
    };

    checkPendingTasks();
  }, []);

  const handlePendingTasks = (tasks: any[]) => {
    console.log('Handling pending tasks:', tasks);
    navigation.navigate('PendingTasksScreen', { tasks });
  };

  
  const getTabBarStyle = (route: Partial<Route<string>>) => {  
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  
    if (routeName === 'PendingTasksScreen') {
      return { display: 'none' }; // Hide the tab bar for PendingTasksScreen
    }
  
    // Default styles for other screens
    return {
      display: 'flex',
      backgroundColor: '#E8E8E8',
      height: 100,
      position: 'absolute',
    };
  };

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
        options={({route}) =>({
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
          tabBarStyle: getTabBarStyle(route),
        })}
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
        name="WineGroupStack"
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
