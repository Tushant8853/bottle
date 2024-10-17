import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import StoriesImg from "../../../assets/png/HeaderIcon.png";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
interface Memory {
  id: number;
  name: string;
  short_description: string;
  image?: string | null;
}

const StoriesList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const imagePrefix = "https://intlnpublic.s3.amazonaws.com/";

  const [search, setSearch] = useState<string>("");
  const [memories, setMemories] = useState<Memory[]>([]);

  const updateSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  useEffect(() => {
    const fetchMemories = async () => {
      const { data: memoriesData, error } = await supabase
        .from("bottleshock_memories")
        .select("id,name, short_description");
      if (error) {
        console.error("Error fetching memories:", error.message);
        return;
      }
      const updatedMemories = await Promise.all(
        memoriesData.map(async (memory: Memory) => {
          const { data: gallery, error: galleryError } = await supabase
            .from("bottleshock_memory_gallery")
            .select("file")
            .eq("memory_id", memory.id)
            .eq("is_thumbnail", true);

          if (galleryError) {
            console.error("Error fetching gallery:", galleryError);
            return { ...memory, image: null };
          }

          const image =
            gallery.length > 0 ? imagePrefix + gallery[0].file : null;

          return { ...memory, image };
        })
      );

      setMemories(updatedMemories);
    };

    fetchMemories();
  }, []);

  return (
    <View style={styles.StoriesListContainer}>
      <View style={styles.SearchStories}>
        <SearchBar
          placeholder="Search..."
          onChangeText={updateSearch}
          value={search}
          round
          lightTheme
          searchIcon={<Icon name="search" size={30} />}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputStyle}
        />
      </View>
      <View style={styles.StoriesListMain}>
        <ScrollView style={styles.ListOfStoriesContainer}>
          {memories.map((memory, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("StoriesDetail", { memoryId: memory.id })
              }
            >
              <View style={styles.Stories}>
                <View style={styles.StoriesImgContainer}>
                  {memory.image ? (
                    <Image
                      source={{ uri: memory.image }}
                      style={styles.StoriesImage}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/png/HeaderIcon.png")}
                      style={styles.StoriesImage}
                    />
                  )}
                </View>
                <View style={styles.StoriesText}>
                  <View style={styles.StoriesTitle}>
                    <View style={styles.StoriesTitleTextContainer}>
                      <Text style={styles.StoriesTitleText} numberOfLines={1}>
                        {memory.name}
                      </Text>
                    </View>
                    <View style={styles.StoriesTitleIMG}>
                      <Icon
                        name="heart-outline"
                        type="ionicon"
                        size={30}
                        color="black"
                        marginRight={5}
                      />
                      <Icon
                        name="enter-outline"
                        type="ionicon"
                        size={30}
                        color="black"
                        containerStyle={{ transform: [{ rotate: "90deg" }] }}
                      />
                    </View>
                  </View>
                  <Text style={styles.StoriesSubtitle} numberOfLines={3}>
                    {memory.short_description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default StoriesList;

const styles = StyleSheet.create({
  StoriesListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "white",
  },
  searchContainer: {
    paddingHorizontal: 16,
    height: 48,
    width: "100%",
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderBottomWidth: 1,
    height: 40,
    width: "100%",
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
  },
  inputStyle: {
    color: "#000",
  },
  ListOfStoriesContainer: {},
  Stories: {
    flexDirection: "row",
    marginBottom: 4,
    marginTop: 4,
    height: 108,
  },

  StoriesListMain: {
    marginTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  StoriesImgContainer: {
    justifyContent: "center",
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  StoriesImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  StoriesText: {
    flex: 1,
    height: 60,
  },
  StoriesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  StoriesTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  StoriesSubtitle: {
    fontSize: 16,
    color: "gray",
  },
  StoriesDescription: {
    fontSize: 14,
    color: "#522F60",
  },
  StoriesTitleIMG: {
    flexDirection: "row",
    alignItems: "center",
  },
  SearchStories: {},
  StoriesTitleTextContainer: {},
});
