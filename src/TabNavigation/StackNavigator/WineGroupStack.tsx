import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Platform, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import StoriesDetail from '../../screens/HomeScreens/Stories/StoriesDetail/StoriesDetails';
import WineDashboard from '../../screens/HomeWine/WineDashboard';
import MemoriesDetails from '../../screens/HomeScreens/Memories/MemoriesDetails/MemoriesDetails';
import RestaurantsDetails from '../../screens/HomeScreens/Restaurants/RestaurantsDetails/RestaurantsDetails';
import WineriesDetails from '../../screens/HomeScreens/Wineries/WineriesDetails/WineriesDetails';
import WineDetails from '../../screens/HomeScreens/DiscoverWinePages/Feature/WineDetail/WineDetails';
import LoginScreen from '../../screens/AuthScreens/LoginScreen';
import Language from '../../screens/HomeWine/Settings/Language';
import Savedmymemories from '../../screens/HomeWine/Settings/saved/Savedmymemories';
import Savedothermemories from '../../screens/HomeWine/Settings/saved/Savedothermemories';
import Savedrestaurants from '../../screens/HomeWine/Settings/saved/Savedrestaurants';
import Profile from '../../screens/HomeWine/Profile';
import NameAndUser_Handle from '../../screens/HomeWine/Profile/Feature/NameAndUser_Handle';
import ChangePwd from '../../screens/HomeWine/Profile/Feature/ChangePwd';
import Savedwineries from '../../screens/HomeWine/Settings/saved/Savedwineries';
import Savedstories from '../../screens/HomeWine/Settings/saved/Savedstories';
import Savedwines from '../../screens/HomeWine/Settings/saved/Savedwines';
import Favouritemymemories from '../../screens/HomeWine/Settings/favourite/Favouritemymemories';
import Favouriteothersmemories from '../../screens/HomeWine/Settings/favourite/Favouriteothersmemories';
import Favouriterestaurants from '../../screens/HomeWine/Settings/favourite/Favouriterestaurants';
import Favouritewineries from '../../screens/HomeWine/Settings/favourite/Favouritewineries';
import Favouritestories from '../../screens/HomeWine/Settings/favourite/Favouritestories';
import Favouritewines from '../../screens/HomeWine/Settings/favourite/Favouritewines';
import Icon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from 'react-i18next';
import { useNavigationState } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const WineGroupStack: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
      const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="WineDashboard">
    <Stack.Screen
        name="WineDashboard"
        component={WineDashboard}
        options={{
            headerShown: true,
            title: t('settings'),
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
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
    />
    <Stack.Screen
        name="Language"
        component={Language}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: 'Language',
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
        })}
    />
    <Stack.Screen
        name="Savedmymemories"
        component={Savedmymemories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('savedmymemories'),
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
        })}
    />
    <Stack.Screen
        name="Savedothermemories"
        component={Savedothermemories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('savedmymemories'),
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
        })}
    />
    <Stack.Screen
        name="Savedrestaurants"
        component={Savedrestaurants}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('savedrestaurants'),
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
        })}
    />
    <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('profile'),
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
        })}
    />
    <Stack.Screen
        name="NameAndUser_Handle"
        component={NameAndUser_Handle}
        options={({ navigation, route }) => ({
            title: t('userhandle'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            title: t('changepassword'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            headerTitleAlign: 'center',
        })}
    />

    <Stack.Screen
        name="Savedwineries"
        component={Savedwineries}
        options={({ navigation, route }) => ({
            headerShown: true,
            title:t('savedwineries'),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
        })}
    />
    <Stack.Screen
        name="Savedstories"
        component={Savedstories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('savedstories'),
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
        })}
    />
    <Stack.Screen
        name="Favouritemymemories"
        component={Favouritemymemories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('favourite_my_memories'),
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
        })}
    />
    <Stack.Screen
        name="Favouriteothersmemories"
        component={Favouriteothersmemories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('favourite_my_memories'),
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
        })}
    />
    <Stack.Screen
        name="Favouriterestaurants"
        component={Favouriterestaurants}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('favourite_restaurants'),
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
        })}
    />
    <Stack.Screen
        name="Favouritestories"
        component={Favouritestories}
        options={({ navigation, route }) => ({
            headerShown: true,
            title:t('favourite_stories'),
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
        })}
    />
    <Stack.Screen
        name="Favouritewineries"
        component={Favouritewineries}
        options={({ navigation, route }) => ({
            headerShown: true,
            title:t('favourite_wineries'),
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
        })}
    />
    <Stack.Screen
        name="Savedwines"
        component={Savedwines}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('savedwines'),
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
        })}
    />
    <Stack.Screen
        name="Favouritewines"
        component={Favouritewines}
        options={({ navigation, route }) => ({
            headerShown: true,
            title: t('favourite_wines'),
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
        })}
    />
    <Stack.Screen
        name="WineDetails"
        component={WineDetails}
        options={{ headerShown: false }}
    />
    <Stack.Screen
        name="RestaurantsDetails"
        component={RestaurantsDetails}
        options={({ navigation, route }) => ({
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
        })}
    />
    <Stack.Screen
        name="MemoriesDetails"
        component={MemoriesDetails}
        options={({ navigation, route }) => ({
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
        })}
    />
    <Stack.Screen
        name="StoriesDetail"
        component={StoriesDetail}
        options={({ navigation, route }) => ({
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
        })}
    />
    <Stack.Screen
        name="WineriesDetails"
        component={WineriesDetails}
        options={({ navigation, route }) => ({
            headerShown: true,
            title:t('wineries'),
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
        })}
    />
</Stack.Navigator>

  );
};

export default WineGroupStack;
