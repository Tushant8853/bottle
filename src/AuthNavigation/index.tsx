import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import TabNavigation from '../TabNavigation/index';
import { RootState } from '../redux/store'; // Adjust this import according to your project structure

// Define the stack type
type AuthStackParamList = {
  LoginScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  // Typing the selector using RootState, assuming userId is stored in the global state
  const userId = useSelector((state: RootState) => state.userId);

  return (
    <NavigationContainer>
      {userId === '' ? (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <TabNavigation />
      )}
    </NavigationContainer>
  );
};

export default AuthNavigation;
