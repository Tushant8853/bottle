import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../../screens/HomeScreens/DashBoard/DashBoard';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import StoriesList from '../../screens/HomeScreens/Stories/StoriesList/StoriesList';
import StoriesDetail from '../../screens/HomeScreens/Stories/StoriesDetail/StoriesDetails';
import MemoriesList from '../../screens/HomeScreens/Memories/MemoriesList/Memories';
import WineriesList from '../../screens/HomeScreens/Wineries/WineriesList/WineriesList';
import MemoriesDetails from '../../screens/HomeScreens/Memories/MemoriesDetails/MemoriesDetails';
import Thumbnail from '../../screens/HomeScreens/Memories/MemoriesDetails/Feature/GalleryView/Thumbnail';
import RestaurantsList from '../../screens/HomeScreens/Restaurants/RestaurantsList/RestaurantsList';
import RestaurantsDetails from '../../screens/HomeScreens/Restaurants/RestaurantsDetails/RestaurantsDetails';
import WineriesDetails from '../../screens/HomeScreens/Wineries/WineriesDetails/WineriesDetails';
import DiscoverWinespages from '../../screens/HomeScreens/DiscoverWinePages/DiscoverWinesPage';
import WineListVarietal from '../../screens/HomeScreens/DiscoverWinePages/Feature/WineListVarietal/WineListVarietal';
import WineListVintage from '../../screens/HomeScreens/DiscoverWinePages/Feature/WineListVintage/WineListVintage';
import WineDetails from '../../screens/HomeScreens/DiscoverWinePages/Feature/WineDetail/WineDetails';
import EditMyMemories from '../../screens/HomeScreens/Memories/MemoriesDetails/Feature/EditMyMemories/EditMyMemories';
import EditMemoryField from '../../screens/HomeScreens/Memories/MemoriesDetails/Feature/EditMyMemories/EditMemoryField';

import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();

const UserDashboardStack: React.FC = () => {
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
            headerShown: true,
            title: t('Stories'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="StoriesDetail"
        component={StoriesDetail}
        options={{
            headerShown: true,
            title: t('Stories'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="MemoriesList"
        component={MemoriesList}
        options={{
            headerShown: true,
            title: t('Memories'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="WineriesList"
        component={WineriesList}
        options={{
            headerShown: true,
            title: t('wineries'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="WineriesDetails"
        component={WineriesDetails}
        options={{
            headerShown: true,
            title: '',
            headerLeft: () => (
                <TouchableOpacity onPress={handleGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="Thumbnail"
        component={Thumbnail}
        options={{
            headerShown: true,
            title: t('gallery'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="MemoriesDetails"
        component={MemoriesDetails}
        options={{
            headerShown: true,
            title: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="RestaurantsList"
        component={RestaurantsList}
        options={{
            headerShown: true,
            title: t('restaurants'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="RestaurantsDetails"
        component={RestaurantsDetails}
        options={{
            headerShown: true,
            title: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}   >
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="DiscoverWinespages"
        component={DiscoverWinespages}
        options={{
            headerShown: true,
            title: t('discoverwines'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="WineListVarietal"
        component={WineListVarietal}
        options={{
            headerShown: true,
            title: t('winesvarietal'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
        }}
    />
    <Stack.Screen
        name="WineListVintage"
        component={WineListVintage}
        options={{
            headerShown: true,
            title: t('vintage'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
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
            title: t('editmymemory'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="angle-left" size={25} color="black" />
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
            headerTitleAlign: 'center',
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

export default UserDashboardStack;
