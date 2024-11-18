import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignUpScreen from '../screens/AuthScreens/SignUpScren';
import TabNavigation from '../TabNavigation/index';
import { RootState } from '../../redux/store';

const Stack = createNativeStackNavigator();

const AuthNavigation: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);

  return (
    <NavigationContainer>
      {userId === '' ? (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <TabNavigation />
      )}
    </NavigationContainer>
  );
};

export default AuthNavigation;