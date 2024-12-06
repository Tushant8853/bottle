/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Platform, View, Text, Pressable, TouchableOpacity } from 'react-native';
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
import SVGComponentWine from '../assets/svg/SvgCodeFile/WineIconTab';
import SVGComponentPerson from '../assets/svg/SvgCodeFile/PersoneTabIcon';
import EditMyMemories from '../screens/HomeScreens/Memories/MemoriesDetails/Feature/EditMyMemories/EditMyMemories';
import EditMemoryField from '../screens/HomeScreens/Memories/MemoriesDetails/Feature/EditMyMemories/EditMemoryField';
import Language from '../screens/HomeWine/Settings/Language';
import Savedmymemories from '../screens/HomeWine/Settings/saved/Savedmymemories';
import Savedothermemories from '../screens/HomeWine/Settings/saved/Savedothermemories';
import Savedrestaurants from '../screens/HomeWine/Settings/saved/Savedrestaurants';
import Profile from '../screens/HomeWine/Profile';
import NameAndUser_Handle from '../screens/HomeWine/Profile/Feature/NameAndUser_Handle';
import ChangePwd from '../screens/HomeWine/Profile/Feature/ChangePwd';
import Savedwineries from '../screens/HomeWine/Settings/saved/Savedwineries';
import Savedstories from '../screens/HomeWine/Settings/saved/Savedstories';
import Savedwines from '../screens/HomeWine/Settings/saved/Savedwines';
import Favouritemymemories from '../screens/HomeWine/Settings/favourite/Favouritemymemories';
import Favouriteothersmemories from '../screens/HomeWine/Settings/favourite/Favouriteothersmemories';
import Favouriterestaurants from '../screens/HomeWine/Settings/favourite/Favouriterestaurants';
import Favouritewineries from '../screens/HomeWine/Settings/favourite/Favouritewineries';
import Favouritestories from '../screens/HomeWine/Settings/favourite/Favouritestories';
import Favouritewines from '../screens/HomeWine/Settings/favourite/Favouritewines';
import DiscoverWines from '../screens/HomeScreens/Wineries/WineriesDetails/Feature/WineEnjoyed';
// Create stack and tab navigators
import Icon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
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
                        headerShown: true,
                        title: 'Stories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="StoriesDetail"
                    component={StoriesDetail}
                    options={{
                        headerShown: true,
                        title: 'Stories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="MemoriesList"
                    component={MemoriesList}
                    options={{
                        headerShown: true,
                        title: 'Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineriesList"
                    component={WineriesList}
                    options={{
                        headerShown: true,
                        title: 'Winery',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineriesDetails"
                    component={WineriesDetails}
                    options={{
                        headerShown: true,
                        title: 'Wineries',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Thumbnail"
                    component={Thumbnail}
                    options={{
                        headerShown: true,
                        title: 'Gallery',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="MemoriesDetails"
                    component={MemoriesDetails}
                    options={{
                        headerShown: true,
                        title: 'Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="RestaurantsList"
                    component={RestaurantsList}
                    options={{
                        headerShown: true,
                        title: 'Restaurants',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="RestaurantsDetails"
                    component={RestaurantsDetails}
                    options={{
                        headerShown: true,
                        title: 'Restaurants',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="DiscoverWinespages"
                    component={DiscoverWinespages}
                    options={{
                        headerShown: true,
                        title: 'Discover Wines',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontFamily: 'Hiragino Sans',
                            fontSize: 13,
                            fontWeight: '600',
                            color: '#30425F',
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineListVarietal"
                    component={WineListVarietal}
                    options={{
                        headerShown: true,
                        title: 'Wine: Varietal',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontFamily: 'Hiragino Sans',
                            fontSize: 13,
                            fontWeight: '600',
                            color: '#30425F',
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineListVintage"
                    component={WineListVintage}
                    options={{
                        headerShown: true,
                        title: 'Vintage',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontFamily: 'Hiragino Sans',
                            fontSize: 13,
                            fontWeight: '600',
                            color: '#30425F',
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineDetails"
                    component={WineDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditMyMemories"
                    component={EditMyMemories}
                    options={{
                        headerShown: true,
                        title: 'Edit My Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="EditMemoryField"
                    component={EditMemoryField}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>

        );
    };

    const StackNavigation3: React.FC = () => {
        return (
            <Stack.Navigator initialRouteName="WineDashboard">
                <Stack.Screen
                    name="WineDashboard"
                    component={WineDashboard}
                    options={{
                        headerShown: true,
                        title: 'Setting',
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Language"
                    component={Language}
                    options={{
                        headerShown: true,
                        title: 'Language',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Savedmymemories"
                    component={Savedmymemories}
                    options={{
                        headerShown: true,
                        title: 'Saved Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Savedothermemories"
                    component={Savedothermemories}
                    options={{
                        headerShown: true,
                        title: 'Saved Memories From Other',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Savedrestaurants"
                    component={Savedrestaurants}
                    options={{
                        headerShown: true,
                        title: 'Saved Restaurants',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        headerShown: true,
                        title: 'Profile',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="NameAndUser_Handle"
                    component={NameAndUser_Handle}
                    options={({ navigation, route }) => ({
                        title: 'User Handle',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                                <Feather name="chevron-left" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    const { handleSave, isButtonDisabled } = route.params || {};
                                    if (handleSave && !isButtonDisabled) {
                                        handleSave();
                                    }
                                }}
                                style={{ marginRight: 10, opacity: route.params?.isButtonDisabled ? 0.5 : 1 }}
                                disabled={route.params?.isButtonDisabled}
                            >
                                <Feather name="check" size={20} />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="ChangePwd"
                    component={ChangePwd}
                    options={({ navigation, route }) => ({
                        headerShown: true,
                        title: 'Change Password',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 10 }}
                                onPress={() => route.params?.handleSavePassword?.()}
                                disabled={route.params?.isTickDisabled}
                            >
                                <Feather
                                    name="check"
                                    size={20}
                                    color={route.params?.isTickDisabled ? "gray" : "black"}
                                />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    })}
                />

                <Stack.Screen
                    name="Savedwineries"
                    component={Savedwineries}
                    options={{
                        headerShown: true,
                        title: 'Saved Wineries',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Savedstories"
                    component={Savedstories}
                    options={{
                        headerShown: true,
                        title: 'Saved Stories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouritemymemories"
                    component={Favouritemymemories}
                    options={{
                        headerShown: true,
                        title: 'Favourite My Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouriteothersmemories"
                    component={Favouriteothersmemories}
                    options={{
                        headerShown: true,
                        title: 'Favourite Memories From Other',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouriterestaurants"
                    component={Favouriterestaurants}
                    options={{
                        headerShown: true,
                        title: 'Favourite Restaurants',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouritestories"
                    component={Favouritestories}
                    options={{
                        headerShown: true,
                        title: 'Favourite Stories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouritewineries"
                    component={Favouritewineries}
                    options={{
                        headerShown: true,
                        title: 'Favourite Wineries',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Savedwines"
                    component={Savedwines}
                    options={{
                        headerShown: true,
                        title: 'Saved Wineries',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="Favouritewines"
                    component={Favouritewines}
                    options={{
                        headerShown: true,
                        title: 'Favourite Wines',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineDetails"
                    component={WineDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RestaurantsDetails"
                    component={RestaurantsDetails}
                    options={{
                        headerShown: true,
                        title: 'Restaurants',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="MemoriesDetails"
                    component={MemoriesDetails}
                    options={{
                        headerShown: true,
                        title: 'Memories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="StoriesDetail"
                    component={StoriesDetail}
                    options={{
                        headerShown: true,
                        title: 'Stories',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen
                    name="WineriesDetails"
                    component={WineriesDetails}
                    options={{
                        headerShown: true,
                        title: 'Wineries',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="angle-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#333",
                        },
                        headerTitleAlign: 'left',
                    }}
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
                            <SVGComponentWine
                                style={{
                                    width: 72,
                                    height: 72,
                                    marginTop: os === 'ios' ? 30 : 0,
                                }}
                            />
                            <Text style={{
                                fontFamily: 'Hiragino Sans',
                                fontSize: 10,
                                fontWeight: '300',
                                lineHeight: 15,
                                textAlign: 'center',
                                textDecorationLine: 'none',
                                color: "#808080",
                            }}>
                                Home
                            </Text>

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
                            <SVGComponentPerson
                                style={{
                                    width: 72,
                                    height: 72,
                                    marginTop: os === 'ios' ? 30 : 0,
                                }}
                            />
                            <Text style={{
                                fontFamily: 'Hiragino Sans',
                                fontSize: 10,
                                fontWeight: '300',
                                lineHeight: 15,
                                textAlign: 'center',
                                textDecorationLine: 'none',
                                color: "#808080",
                            }}>
                                Me
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
