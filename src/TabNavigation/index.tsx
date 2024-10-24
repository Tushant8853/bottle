/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Platform, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './navigationTypes'; // Adjust the path according to your project structure

// Import your screens
import Dashboard from '../screens/HomeScreens/DashBoard/DashBoard';
import StoriesList from '../screens/HomeScreens/Stories/StoriesList/StoriesList';
import StoriesDetail from '../screens/HomeScreens/Stories/StoriesDetail/StoriesDetails';
import MemoriesList from '../screens/HomeScreens/Memories/MemoriesList/Memories';
import MeDashboard from '../screens/HomeMe/MeDashboard';
import WineDashboard from '../screens/HomeWine/WineDashboard';
import WineriesList from '../screens/HomeScreens/Wineries/WineriesList/WineriesList';
import MemoriesDetails from '../screens/HomeScreens/Memories/MemoriesList/MemoriesDetails/MemoriesDetails';
import RestaurantsList from '../screens/HomeScreens/Restaurants/RestaurantsList/RestaurantsList';
import RestaurantsDetails from '../screens/HomeScreens/Restaurants/RestaurantsDetails/RestaurantsDetails';
import WineriesDetails from '../screens/HomeScreens/Wineries/WineriesDetails/WineriesDetails';
// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const StackNavigation1: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="Dashboard">
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
            </Stack.Navigator>
        );
    };

    const StackNavigation2: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="UserDashboard">
                <Stack.Screen
                    name="UserDashboardScreen"
                    component={MeDashboard}
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
            </Stack.Navigator>
        );
    };

    const os = Platform.OS;

    return (
        <Tab.Navigator
            initialRouteName="Home"
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
                            <Image
                                source={require('../assets/png/TabiconBottel.png')}
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
