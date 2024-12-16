import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginUserId } from '../../redux/actions'; // Import the action to set user id
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignUpScreen from '../screens/AuthScreens/SignUpScren';
import TabNavigation from '../TabNavigation/index';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const AuthNavigation: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const storedUserId = await AsyncStorage.getItem('UID');
      if (storedUserId) {
        dispatch(setLoginUserId(storedUserId)); // Set the user ID from AsyncStorage to Redux
      }
    };

    checkUser();
  }, [dispatch]);

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
