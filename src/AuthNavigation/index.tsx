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
import RestaurantsList from '../screens/HomeScreens/Restaurants/RestaurantsList/RestaurantsList';
import MemoriesDetails from '../screens/HomeScreens/Memories/MemoriesDetails/MemoriesDetails';
import WineriesList from '../screens/HomeScreens/Wineries/WineriesList/WineriesList';
import RestaurantsDetails from '../screens/HomeScreens/Restaurants/RestaurantsDetails/RestaurantsDetails';
import WineriesDetails from '../screens/HomeScreens/Wineries/WineriesDetails/WineriesDetails';
import WineDetails from '../screens/HomeScreens/DiscoverWinePages/Feature/WineDetail/WineDetails';
import DashBoard from '../screens/HomeScreens/DashBoard/DashBoard';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['bottleshock://app', 'https://www.bottleshock.wine/app'],
  config: {
    screens: {
      UserDashboard: {
        screens: {
          MemoriesList: 'memories',
          MemoriesDetails: 'memories/:id',
          StoriesList: 'stories',
          StoriesDetail: 'story/:memoryId',
          RestaurantsList: 'restaurants',
          RestaurantsDetails: 'restaurant/:id',
          WineriesList: 'wineries',
          WineriesDetails: 'winery/:id',
          WineDetails: 'wine/:winery_id/:winery_varietals_id/:wine_id',
          EditMyMemories: 'edit-memories',
          EditMemoryField: 'edit-memory-field',
        },
      },
      Home: {
        screens: {
          Dashboard: 'dashboard',
        },
      },
      WineGroup: {
        screens: {
          StoriesDetail: 'storyh',
          WineriesDetails: 'winery',
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


  return (
       <NavigationContainer linking={linking} >
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
