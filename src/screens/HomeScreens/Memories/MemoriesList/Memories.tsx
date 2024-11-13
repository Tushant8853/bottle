import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../TabNavigation/navigationTypes";
import MyMemories from "./Feature/MyMemories/MyMemories";
import PublicMemories from "./Feature/PublicMemories/PublicMemories";
import { useTranslation } from 'react-i18next';
type MemorieListRouteProp = RouteProp<RootStackParamList, 'MemoriesList'>;

const MemorieList: React.FC = () => {
  const route = useRoute<MemorieListRouteProp>();
  const [selectedMemory, setSelectedMemory] = useState<"Public" | "My">("My"); // Set "My" as default
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  useEffect(() => {
    if (route.params?.memoryType) {
      setSelectedMemory(route.params.memoryType);
    }
  }, [route.params?.memoryType]);

  return (
    <View style={styles.StoriesListContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.Backbotton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Memories')}</Text>
      </View>

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
        <Icon name="microphone" size={16} color="#989999" />
      </View>

      <View style={styles.BothMemoriesContainer}>
        <View style={styles.ToggleContainer}>
          <View style={styles.PublicMemoriesContainer}>
            <Pressable
              style={[
                styles.PublicMemoriesToggleButton,
                selectedMemory === "Public" && styles.selectedButton,
              ]}
              onPress={() => setSelectedMemory("Public")}
            >
              <Text
                style={[
                  styles.Text,
                  selectedMemory === "Public" && styles.selectedText,
                ]}
              >
                {t('PublicMemories')}
              </Text>
            </Pressable>
          </View>

          <View style={styles.MyMemoriesContainer}>
            <Pressable
              style={[
                styles.MyMemoriesToggleButton,
                selectedMemory === "My" && styles.selectedButton,
              ]}
              onPress={() => setSelectedMemory("My")}
            >
              <Text
                style={[
                  styles.Text,
                  selectedMemory === "My" && styles.selectedText,
                ]}
              >
                {t('mymemories')}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.ComponentContainer} >
        {selectedMemory === "My" ? <MyMemories /> : <PublicMemories />}
        </View>

      </View>
    </View>
  );
};

export default MemorieList;

const styles = StyleSheet.create({
  StoriesListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "white",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    paddingRight: 40,
    color: "#333",
    textAlign: "center",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  Backbotton: {
    width: 25,
    height: 19,
  },
  BothMemoriesContainer: {
    height: '100%',
  },
  ToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 39,
    marginHorizontal: 30,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    width: 'auto',
    backgroundColor: '#F3F3F3',
  },
  PublicMemoriesContainer: {
    alignSelf: "center",
    justifyContent:"center",
    marginLeft: 4,
    flex: 1,
  },
  MyMemoriesContainer: {
    alignSelf: "center",
    flex: 1,
    marginRight: 4,
  },
  PublicMemoriesToggleButton: {
    height: 28,
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 7,
  },
  MyMemoriesToggleButton: {
    height: 28,
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 7,
  },
  selectedButton: {
    backgroundColor: "white",
    shadowColor: '#000', // The color of the shadow
    shadowOffset: { width: 0, height: 3 }, // X and Y offset
    shadowOpacity: 0.1, // Opacity matching #0000000A
    shadowRadius: 1, // Matching the first shadow blur radius of 1px

    // Elevation for Android
    elevation: 3, // Creates the shadow effect in Android (approximation of 3px shadow)

    // Second shadow properties
    shadowOpacity: 0.31, // Opacity matching #0000001F (31% opacity)
    shadowRadius: 8, // Matching the second shadow blur radius of 8px
  },
  Text: {
    fontSize: 13,
    color: "#522F60",
    fontFamily: 'SF Pro',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  ComponentContainer:{
    marginTop: 4,
    marginBottom: 4,
    borderTopWidth: 1,
  },
});
