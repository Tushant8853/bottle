import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, TextInput, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
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

  // Example of dynamic styling based on search input
  const [highlightSearchBar, setHighlightSearchBar] = useState<boolean>(false);

  const updateSearch = (searchValue: string) => {
    setSearch(searchValue);
    // Example: Highlight the search bar if search text is more than 3 characters
    setHighlightSearchBar(searchValue.length > 3);
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

          const image = gallery.length > 0 ? imagePrefix + gallery[0].file : null;

          return { ...memory, image };
        })
      );

      setMemories(updatedMemories);
    };

    fetchMemories();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.Backbotton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
      <Text style={styles.headerTitle}>Stories</Text>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#989999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search"
          placeholderTextColor={'#e5e8e8'}
         // value={searchQuery}
          //onChangeText={handleSearch}
        />
        <Icon name="microphone" size={16} color="#989999" />
      </View>
      <View style={styles.StoriesListMain}>
        <ScrollView style={styles.ListOfStoriesContainer}>
          {memories.map((memory, index) => (
            <Pressable
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
                        name="heart-o"
                        size={16}
                        color="#808080"
                        marginRight={5}
                      />
                      <Icons
                        name="share-outline"
                        size={17}
                        color="#808080"
                      />
                    </View>
                  </View>
                  <View>
                  <Text style={styles.StoriesSubtitle} numberOfLines={3}>
                  ~New Legend is Born~
                  </Text>
                  </View>
                  <Text style={styles.StoriesDescription} numberOfLines={3}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...
                  </Text>
                </View>
              </View>
            </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#522F60',
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 1,
    marginHorizontal: 16,
    marginBottom: 13,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    height: 40,
  },
  // Dynamic styling for search bar highlight
  highlightSearch: {
    borderColor: "green", // Highlight border
    borderWidth: 2, // Add a thicker border
  },
  
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 1,
    paddingTop: 47,
    backgroundColor: 'white',
    width: '100%',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlignVertical: 'center',
    width: '100%',
    paddingRight: 40,
    color: '#333',
    textAlign: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 7,

  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color:'black',
  },
  ListOfStoriesContainer: {
    //borderWidth: 1,
    borderTopWidth:1.1,
    borderColor: '#808080',
    paddingHorizontal: 16,
  },
  Stories: {
  
    flexDirection: "row",
    marginBottom: 4,
    marginTop: 4,
    height: 108,
  },
  Backbotton: {
    width: 25,
    height: 19,
  },
  StoriesListMain: {
  
    marginTop: 8,
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
    fontSize: 13,
    fontWeight: "600",
    color: "black",
    paddingTop: 5
  },
  StoriesSubtitle: {
    fontSize: 11,
    color: "gray",
  },
  StoriesDescription: {
    fontSize: 11,
    color: "#522F60",
    lineHeight: 16.5,
    paddingTop: 5
  },
  StoriesTitleIMG: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5
  },
  SearchStories: {},
  StoriesTitleTextContainer: {
    width:'75%',
  },
});
