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
import { Linking, LinkingEventType } from 'react-native';

const Stack = createNativeStackNavigator();

const linkingConfig = {
  prefixes: ['www.bottleshock.wine://app', 'https://www.bottleshock.wine/app'],
  config: {
    screens: {
      LoginScreen: '/login',
      SignUpScreen: '/signup',
      StoriesList: '/story',
      StoriesDetail: '/story/:id',
      TabNavigation: {
        screens: {
          Home: 'home',
          Profile: 'profile',
        },
      },
    },
  },
};

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

  // Deep linking support and logging
  useEffect(() => {
    const handleInitialLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        console.log('Initial URL:', initialUrl || 'No initial URL found');
      } catch (error) {
        console.error('Error fetching initial URL:', error);
      }
    };

    const handleLinkEvent = (event: LinkingEventType) => {
      console.log('Deep Link Event URL:', event.url);
    };

    // Subscribe to deep linking events
    const subscription = Linking.addListener('url', handleLinkEvent);

    // Check for initial deep link
    handleInitialLink();

    // Cleanup
    return () => {
      try {
        subscription.remove(); // Unsubscribe from events when the component unmounts
      } catch (error) {
        console.error('Error removing link subscription:', error);
      }
    };
  }, []);

  return (
    <NavigationContainer linking={linkingConfig}>
      {userId ? (
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
      )}
    </NavigationContainer>
  );
};

export default AuthNavigation;
