import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginUserId } from '../../redux/actions';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignUpScreen from '../screens/AuthScreens/SignUpScren';
import TabNavigation from '../TabNavigation/index';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();


const AuthNavigation: React.FC = (): JSX.Element => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  // Check user from AsyncStorage and set it in Redux
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UID');
        if (storedUserId) {
          dispatch(setLoginUserId(storedUserId)); // Set user ID from AsyncStorage to Redux
        } else {
          console.log('No stored user ID found.');
        }
      } catch (error) {
        console.error('Error reading UID from AsyncStorage:', error);
      }
    };

    checkUser();
  }, [dispatch]);




  return (
        userId ? (
        <TabNavigation />
      ) : (
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
      )
  );
};

export default AuthNavigation;
