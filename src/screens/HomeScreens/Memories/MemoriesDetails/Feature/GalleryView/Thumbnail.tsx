import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Modal, TouchableOpacity, Text } from 'react-native';
import { useRoute, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import { TwicImg, installTwicPics } from '@twicpics/components/react-native';
import { Ionicons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../../TabNavigation/navigationTypes";
// Install TwicPics with the appropriate configuration
installTwicPics({
  domain: 'https://bottleshock.twic.pics/',
  debug: true,
  maxDPR: 3,
});

type Memory = {
  file: string; // Update this type according to your actual data structure
};

const Thumbnail: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imagePrefix = "https://bottleshock.twic.pics/file/";
  const route = useRoute<RouteProp<{ params: { memoryId: string } }, 'params'>>();
  const { memoryId } = route.params;
  const groupedMemories = [];
  const totalImages = memories.length;

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const { data: memoriesData, error } = await supabase
          .from("bottleshock_memory_gallery")
          .select("file")
          .eq("memory_id", memoryId);

        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }

        if (memoriesData && memoriesData.length > 0) {
          console.log("Fetched memories data:", memoriesData);
          setMemories(memoriesData);
        } else {
          console.log("No memories found for the given memoryId.");
        }
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchMemories();
  }, [memoryId]);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Memory }) => {
    const imageUrl = imagePrefix + item.file; // Construct the image URL

    return (
      <View style={styles.thumbnailContainer}>
        <TouchableOpacity onPress={() => openModal(imageUrl)}>
          <TwicImg
            src={imageUrl}
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPair = ({ item }: { item: (Memory | null)[] }) => (
    <View style={styles.row}>
      {item.map((memory, index) => {
        const imageUrl = memory ? imagePrefix + memory.file : null; // Construct the image URL if memory exists
        return (
          <View key={index} style={styles.thumbnailContainer}>
            {memory ? (
              <TouchableOpacity onPress={() => openModal(imageUrl!)}>
                <TwicImg
                  src={imageUrl}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.thumbnailPlaceholder} /> // Placeholder for empty space
            )}
          </View>
        );
      })}
    </View>
  );

  for (let i = 0; i < totalImages; i += 3) {
    // Create a new group with 3 images or fill with nulls for empty spaces
    const group = [
      memories[i] || null,
      memories[i + 1] || null,
      memories[i + 2] || null,
    ];
    groupedMemories.push(group);
  }

  return (
    <View style={styles.ContainerThu}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-left" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.Maincontainer}>
        <View style={styles.container}>
          <FlatList
            data={groupedMemories}
            renderItem={renderPair}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>
            {selectedImage && (
              <TwicImg
                src={selectedImage}
                style={styles.modalImage}
              />
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ContainerThu:{
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center', // Align items in a row
    justifyContent: 'space-between', // Ensure there's space between back button and error message
  },
  backButtonText:{
    marginLeft:10,
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  backButton: {
    borderWidth:  1,
    width:20,
    marginLeft:0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  thumbnailContainer: {
    flex: 1,
    margin: 1,
  },
  thumbnail: {
    height: 90,
    borderRadius: 4,
  },
  thumbnailPlaceholder: {
    height: 90,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
  },
  modalImage: {
    width: '95%',
    height: '95%',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: '5%',
    right: '45%',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional background for visibility
    borderRadius: 20,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default Thumbnail;
