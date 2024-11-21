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


const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setVisibleDropdown(visibleDropdown === menu ? null : menu);
  };

  const handleOptionPress = (menu: string, option: string) => {
    console.log(`Menu: ${menu}, Selected: ${option}`);
    if (menu === "saved" && option === "My Memories") {
      navigation.navigate("Savedmymemories"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && option === "Other Memories") {
      navigation.navigate("Savedothermemories"); // Navigate to SavedMemories screen
    }
    if (menu === "saved" && option === "Restaurants") {
      navigation.navigate("Savedrestaurants"); // Navigate to SavedMemories screen
    }
    setVisibleDropdown(null); // Close dropdown after selection
  };

  const savedOptions = [
    "My Memories",
    "Other Memories",
    "Restaurants",
    "Wineries",
    "Wines",
    "Stories",
  ];

  const favouriteOptions = [
    "My Memories",
    "Other Memories",
    "Restaurants",
    "Wineries",
    "Wines",
    "Stories",
  ];

  const handleLogout = async () => {
    try {
      // Clear authentication data (e.g., tokens) from AsyncStorage
      await AsyncStorage.removeItem('UID'); // Replace with your actual token key
      // Optionally, clear any other data you might have cached

      // Dispatch Redux action to clear user state
      dispatch(setLoginUserId('')); // Set the userId to empty string to reflect logout in Redux state

      // Reset the navigation stack to LoginScreen
      // This assumes the AuthNavigation will manage the login screen flow
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

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
          placeholder="Search"
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
          <Text style={styles.menuText}>Profile</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Icon name="notifications-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => toggleDropdown("saved")}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="bookmark-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Saved</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {visibleDropdown === "saved" && (
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
          onPress={() => toggleDropdown("favourite")}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="heart-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Favourite</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {visibleDropdown === "favourite" && (
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

        {/* Privacy */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Icon name="lock-closed-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Privacy</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {/* Security */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Icon name="shield-checkmark-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>Security</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Icon name="information-circle-outline" size={16} color="#522F60" />
          </View>
          <Text style={styles.menuText}>About</Text>
          <Icon name="chevron-forward-outline" size={16} color="black" />
        </TouchableOpacity>
        <View style={styles.lastSection}></View>
        <View style={styles.loginSection}>
          <Text style={styles.loginTitle}>Logins</Text>
          <TouchableOpacity>
            <Text style={styles.loginOption}>Add or switch accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.loginOption}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.loginOption}>Log out all accounts</Text>
          </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  loginTitle: {
    color: '"black"',
    fontSize: 16,
    marginBottom: 10,
  },
  loginOption: {
    color: '#522F60',
    fontSize: 16,
    marginBottom: 10,
  },
  lastSection: {
    marginBottom: 10,
  },
});

export default SettingsScreen;''