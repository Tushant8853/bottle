import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from "@twicpics/components/react-native";

// Configure TwicPics
installTwicPics({
  domain: "https://bottleshock.twic.pics/",
  debug: true,
  maxDPR: 3,
});

const WineriesList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [wineries, setWineries] = useState<any[]>([]);
  const imagePrefix = "https://bottleshock.twic.pics/file/";

  useEffect(() => {
    const fetchWineries = async () => {
      const { data, error } = await supabase
        .from("bottleshock_wineries")
        .select("id, name, location, verified, banner");

      if (error) {
        console.error("Error fetching wineries:", error.message);
        return;
      }

      const formattedWineries = data.map((winery: any) => ({
        id: winery.id,
        name: winery.name,
        location: winery.location,
        logo: winery.banner ? `${imagePrefix}${winery.banner}` : null,
        verified: winery.verified,
      }));

      setWineries(formattedWineries);
    };

    fetchWineries();
  }, []);

  // Handle search filtering
  const filteredWineries = wineries.filter((winery) =>
    winery.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Winery</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={"#e5e8e8"}
          value={searchText}
          onChangeText={setSearchText}
        />
        <FontAwesome name="microphone" size={16} color="#989999" />
      </View>

      {/* List of Wineries */}
      <ScrollView>
        {filteredWineries.map((winery) => (
          <View key={winery.id} style={styles.wineryContainer}>
            {/* Winery Info */}
            <View style={styles.wineryInfo}>
              <Text style={styles.wineryName}>
                {winery.name}  {winery.verified && (
                  <MaterialIcons
                    name="verified"
                    size={13}
                    color="#522F60"
                  />
                )}
              </Text>
              <Text style={styles.wineryLocation}>{winery.location}</Text>
            </View>

            {/* Action Icons */}
            <View style={styles.iconsContainer}>
              <TouchableOpacity 
                accessibilityLabel={`Link to ${winery.name}`} 
                accessibilityRole="button"
              >
                <Feather name="paperclip" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity 
                accessibilityLabel={`Favorite ${winery.name}`} 
                accessibilityRole="button"
              >
                <FontAwesome name="heart-o" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity 
                accessibilityLabel={`Share ${winery.name}`} 
                accessibilityRole="button"
              >
                <Ionicons name="share-outline" size={16} color="gray" style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* Winery Logo */}
            {winery.logo && (
              <TwicImg 
                src={winery.logo} 
                style={styles.logo} 
                resizeMode="contain" // Adjusted to fit the image correctly
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 1,
    paddingTop: 47,
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#522F60",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 1,
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
    fontSize: 14,
    color: "black",
  },
  wineryContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  wineryInfo: {
    flex: 1,
    paddingRight: 10,
  },
  wineryName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#3C3C3C',
  },
  wineryLocation: {
    fontSize: 11,
    color: 'gray',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 7 // Align icons to the top
  },
  icon: {
    marginHorizontal: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#522F60',
  },
  backButton: {
    marginRight: 10, // Add some margin for better spacing
  },
});

export default WineriesList;
