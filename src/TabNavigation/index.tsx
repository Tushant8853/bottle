/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Platform, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './navigationTypes';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';


import Dashboard from '../screens/HomeScreens/DashBoard/DashBoard';
import StoriesList from '../screens/HomeScreens/Stories/StoriesList/StoriesList';
import StoriesDetail from '../screens/HomeScreens/Stories/StoriesDetail/StoriesDetails';
import MemoriesList from '../screens/HomeScreens/Memories/MemoriesList/Memories';
import MeDashboard from '../screens/HomeMe/MeDashboard';
import WineDashboard from '../screens/HomeWine/WineDashboard';
import WineriesList from '../screens/HomeScreens/Wineries/WineriesList/WineriesList';
import MemoriesDetails from '../screens/HomeScreens/Memories/MemoriesDetails/MemoriesDetails';
import Thumbnail from '../screens/HomeScreens/Memories/MemoriesDetails/Feature/GalleryView/Thumbnail';
import RestaurantsList from '../screens/HomeScreens/Restaurants/RestaurantsList/RestaurantsList';
import RestaurantsDetails from '../screens/HomeScreens/Restaurants/RestaurantsDetails/RestaurantsDetails';
import WineriesDetails from '../screens/HomeScreens/Wineries/WineriesDetails/WineriesDetails';
import DiscoverWinespages from '../screens/HomeScreens/DiscoverWinePages/DiscoverWinesPage';
import WineListVarietal from '../screens/HomeScreens/DiscoverWinePages/Feature/WineListVarietal/WineListVarietal';
import WineListVintage from '../screens/HomeScreens/DiscoverWinePages/Feature/WineListVintage/WineListVintage';
import WineDetails from '../screens/HomeScreens/DiscoverWinePages/Feature/WineDetail/WineDetails';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import BottleTabIcon from "../assets/svg/SvgCodeFile/bottleTabIcon"
import SVGComponent from '../assets/svg/SvgCodeFile/bottleTabIcon';
import EditMyMemories from '../screens/HomeScreens/Memories/MemoriesDetails/Feature/EditMyMemories/EditMyMemories';

import Language from '../screens/HomeWine/Settings/Language';
import Savedmymemories from '../screens/HomeWine/Settings/saved/Savedmymemories';
import Savedothermemories from '../screens/HomeWine/Settings/saved/Savedothermemories';
// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const linking = {
    prefixes: ['bottleshock://'], // Your app's deep link prefix
    config: {
        screens: {
            StoriesList: '',
            StoriesDetail: 'story/:id', // Handle the deep link like `bottleshock://story/2`
        },
    },
};

const TabNavigation: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const StackNavigation1: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="Dashboard">
                <Stack.Screen
                    name="UserDashboardScreen"
                    component={MeDashboard}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>

        );
    };

    const StackNavigation2: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="UserDashboard">
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StoriesList"
                    component={StoriesList}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="StoriesDetail"
                    component={StoriesDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MemoriesList"
                    component={MemoriesList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WineriesList"
                    component={WineriesList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WineriesDetails"
                    component={WineriesDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Thumbnail"
                    component={Thumbnail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MemoriesDetails"
                    component={MemoriesDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RestaurantsList"
                    component={RestaurantsList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RestaurantsDetails"
                    component={RestaurantsDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DiscoverWinespages"
                    component={DiscoverWinespages}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WineListVarietal"
                    component={WineListVarietal}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WineListVintage"
                    component={WineListVintage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WineDetails"
                    component={WineDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditMyMemories"
                    component={EditMyMemories}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>

        );
    };

    const StackNavigation3: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="WineDashboard">
                <Stack.Screen
                    name="WineDashboardScreen"
                    component={WineDashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Language"
                    component={Language}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="Savedmymemories"
                    component={Savedmymemories}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="Savedothermemories"
                    component={Savedothermemories}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>

        );
    };

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
                component={StackNavigation2}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../assets/png/TabiconGlass.png')}
                                style={{
                                    width: 72,
                                    height: 72,
                                    marginTop: os === 'ios' ? 30 : 0,
                                    tintColor: focused ? '#522F60' : 'gray',
                                    marginBottom: 24,
                                }}
                            />
                        </View>
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Home"
                component={StackNavigation1}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <SVGComponent
                                style={{
                                    width: 72,
                                    height: 72,
                                    marginTop: os === 'ios' ? 30 : 0,
                                    tintColor: focused ? '#522F60' : 'gray',
                                    marginBottom: 24,
                                }} />

                        </View>
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="WineGroup"
                component={StackNavigation3}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../assets/png/TabiconMe.png')}
                                style={{
                                    width: 72,
                                    height: 72,
                                    marginTop: os === 'ios' ? 30 : 0,
                                    tintColor: focused ? '#522F60' : 'gray',
                                    marginBottom: 24,
                                }}
                            />
                        </View>
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;
