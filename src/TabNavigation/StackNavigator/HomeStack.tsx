import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import MeDashboard from '../../screens/HomeMe/MeDashboard';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const HomeStack: React.FC = () => {
     const navigation = useNavigation<NavigationProp<RootStackParamList>>();
        const { t } = useTranslation();
        const handleGoBack = () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Dashboard'); // Replace 'Home' with your default screen name
            }
          };
  return (
    <Stack.Navigator initialRouteName="UserDashboardScreen">
      <Stack.Screen
        name="UserDashboardScreen"
        component={MeDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
