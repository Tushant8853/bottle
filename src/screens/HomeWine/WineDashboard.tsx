// SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../TabNavigation/navigationTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLoginUserId } from '../../../redux/actions';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [savedDropdownVisible, setSavedDropdownVisible] = useState(false);
  const [favouriteDropdownVisible, setFavouriteDropdownVisible] = useState(false);
  const { t } = useTranslation();


  const toggleSavedDropdown = () => {
    setSavedDropdownVisible(!savedDropdownVisible);
  };

  const toggleFavouriteDropdown = () => {
    setFavouriteDropdownVisible(!favouriteDropdownVisible);
  };

  const handleOptionPress = (menu: string, option: string) => {
    console.log(`Menu: ${menu}, Selected: ${option}`);
    if (menu === "saved" && (option === "My Memories" || option === "自分のメモリーズ")) {
      navigation.navigate("Savedmymemories"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && (option === "Memories from Others" || option === "他のユーザーのメモリーズ")) {
      navigation.navigate("Savedothermemories"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && (option === "Restaurants" || option === "レストラン")) {
      navigation.navigate("Savedrestaurants"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && (option === "Wineries" || option === "ワイナリー")) {
      navigation.navigate("Savedwineries"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && (option === "Stories" || option === "ストーリーズ")) {
      navigation.navigate("Savedstories"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "My Memories" || option === "自分のメモリーズ")) {
      navigation.navigate("Favouritemymemories"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "Memories from Others" || option === "他のユーザーのメモリーズ")) {
      navigation.navigate("Favouriteothersmemories"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "Restaurants" || option === "レストラン")) {
      navigation.navigate("Favouriterestaurants"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "Wineries" || option === "ワイナリー")) {
      navigation.navigate("Favouritewineries"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "Stories" || option === "ストーリーズ")) {
      navigation.navigate("Favouritestories"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && (option === "Wines" || option === "ワイン")) {
      navigation.navigate("Savedwines"); // Navigate to SavedMemories screen
    }
    if (menu === "favourite" && (option === "Wines" || option === "ワイン")) {
      navigation.navigate("Favouritewines"); // Navigate to SavedMemories screen
    }
  };

  const savedOptions = [
    t("mymemories"),
    t("othermemories"),
    t("restaurants"),
    t("wineries"),
    t("stories"),
    t("wines"),
  ];

  const favouriteOptions = [
    t("mymemories"),
    t("othermemories"),
    t("restaurants"),
    t("wineries"),
    t("stories"),
    t("wines"),
  ];

  const handleLogout = async () => {
    try {
      // Clear authentication data (e.g., tokens) from AsyncStorage
      await AsyncStorage.removeItem('UID');  // Remove UID from AsyncStorage
      await AsyncStorage.removeItem('email'); // Optionally remove email

      // Dispatch Redux action to clear user state
      dispatch(setLoginUserId(''));  // Clear user ID in Redux

      // Reset the navigation stack to LoginScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });

      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  return (
    <View style={styles.container}>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={16}
          color="#989999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search')}
          placeholderTextColor={"#e5e8e8"}
        />
        <Icons name="microphone" size={16} color="#989999" />
      </View>

      {/* Menu Items */}
      <ScrollView contentContainerStyle={styles.menuList}>
        {/* Profile */}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.menuIconContainer}>
            <Icon name="person-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>{t('profile')}</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>



        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleSavedDropdown}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="bookmark-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>{t('saved')}</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {savedDropdownVisible && (
          <View style={styles.dropdown}>
            {savedOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleOptionPress("saved", option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Favourite Menu */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleFavouriteDropdown}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="heart-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>{t('favourite')}</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {favouriteDropdownVisible && (
          <View style={styles.dropdown}>
            {favouriteOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleOptionPress("favourite", option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Activities */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Language")}>
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="language" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Language</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>




        <View style={styles.lastSection}></View>
        <View style={styles.loginSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.loginOption}>{t('logout')}</Text>
            </TouchableOpacity>
            <Text>19</Text>
          </View>
        </View>
      </ScrollView>

      {/* Login Section */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: "center",
    paddingBottom: 1,
    paddingTop: 55,
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlignVertical: "center",
    width: "100%",
    color: "#333",
    textAlign: "center",
    alignItems: "center",
  },
  Backbotton: {
    width: 25,
    height: 19,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#522F60",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 1,
    marginHorizontal: 16,
    marginBottom: 13,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    height: 40,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  menuList: {
    //borderWidth:1,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  menuItem: {
    // borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  menuIconContainer: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#522F60",
    marginLeft: 10,
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
    padding: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  loginSection: {
    borderColor: '#555',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  loginTitle: {
    color: '"black"',
    fontSize: 14,
    marginBottom: 10,
  },
  loginOption: {
    color: '#522F60',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  lastSection: {
    marginBottom: 10,
  },
});

export default SettingsScreen; ''