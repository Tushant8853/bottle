import React, {useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ImageBackground,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../backend/supabase/supabaseClient";
import { saveImageToLocalStorage } from "../../HomeMe/Upload/Uplaod_Local";
import uuid from "react-native-uuid";
import { getLocation } from "../../HomeMe/Upload/Location";
import { useRoute, RouteProp, NavigationProp, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";


type PendingTasksScreenRouteParams = {
    tasks: {
      input1: string;
      input2: string;
      input3: string;
      memoryId?: string;
      fileName: string;
    }[];
  };
  
  type RouteParams = {
    PendingTasksScreen: PendingTasksScreenRouteParams;
  };

const PendingTasksScreen: React.FC = () => {
    const [loading, setLoading] = useState(false);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
const route = useRoute<RouteProp<RouteParams, 'PendingTasksScreen'>>();
const passedTasks = route.params?.tasks || [];
const [pendingTasks, setPendingTasks] = useState(passedTasks);
 const navigation = useNavigation<NavigationProp<RootStackParamList>>();
 



 useEffect(() => {
    const checkPendingTasks = async () => {
        setInput1(pendingTasks[0].input1);
        setInput2(pendingTasks[0].input2)
        setInput3(pendingTasks[0].input3)
    };
    checkPendingTasks();
  }, []);



  console.log("pending tasks:::::::::::",pendingTasks)


  const handleSaveTask = async (
input1: string, input2: string, input3: string, memoryId: string | undefined, fileName: string, 
   
  ) => {
    const isValid =
      input1.trim() !== "" && input2.trim() !== "" && input3.trim() !== "";
    if (!isValid) {
      setError1(input1.trim() === "");
      setError2(input2.trim() === "");
      setError3(input3.trim() === "");
      return;
    }

    setLoading(true);
    try {

     // const fileName = savedFilePath ? savedFilePath.split('/').pop() : 'No thumbnail available';
      const UID = await AsyncStorage.getItem("UID");
      const location = await getLocation();

      if (memoryId) {
        const { error: memoryError } = await supabase
          .from("bottleshock_memory_wines")
          .insert([
            {
              eye_brand: input1,
              eye_varietal: input2,
              eye_vintage: input3,
              user_id: UID,
              user_photo: fileName,
              memory_id: memoryId,
            },
          ]);

        if (memoryError) {
          console.error("Error updating memory:", memoryError);
          return;
        }
      } else {
        const newMemoryId = uuid.v4();

        const { error: memoryError } = await supabase
          .from("bottleshock_memories")
          .insert([
            {
              name: "Untitled memory",
              location_lat: location.latitude,
              location_long: location.longitude,
              address: location.locationName,
              restaurant_id: location.restaurantId,
              user_id: UID,
              id: newMemoryId,
              is_public: true,
              shared_with_friends: true,
            },
          ]);

        if (memoryError) {
          console.error("Error creating new memory:", memoryError);
          return;
        }

        const { error: galleryError } = await supabase
          .from("bottleshock_memory_gallery")
          .insert([
            {
              memory_id: newMemoryId,
              content_type: "PHOTO",
              is_thumbnail: true,
              user_id: UID,
              file: fileName,
            },
          ]);

        if (galleryError) {
          console.error("Error updating memory gallery:", galleryError);
          return;
        }
      }

      const updatedTasks = pendingTasks.filter((t) => t !== pendingTasks[0]);
     // setPendingTasks(updatedTasks);
      await AsyncStorage.setItem("PENDING_TASKS", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error handling task:", error);
    } finally {
      setLoading(false);
      navigation.goBack()
    }
  };

  const handleDeleteTask = async (task: any) => {
    const updatedTasks = pendingTasks.filter((t) => t !== task);
    setPendingTasks(updatedTasks);
    await AsyncStorage.setItem("PENDING_TASKS", JSON.stringify(updatedTasks));
  };

  const getValidUri = (uri: string) => {
                                  const PREFIXX = Platform.OS === 'ios'
                                    ? FileSystem.documentDirectory
                                    : 'file:///data/user/0/host.exp.exponent/files/';
   return `${PREFIXX}${uri}`;


 };
  

  return (
    <View  style={styles.imageBackground}>

    <Image
      source={{ uri: getValidUri(pendingTasks[0].fileName) }}
      style={styles.imageBackground} // Ensures the image covers the entire background
   />
     <Modal visible={true} transparent={true}  animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.inputModal}>
          <TextInput
            style={[styles.input, error1 && styles.inputError]}
            placeholder="Wine name"
            value={input1}
            onChangeText={(text) => {
                setInput1(text);
                if (error1) setError1(false);
              }}          />
          <TextInput
            style={[styles.input, error2 && styles.inputError]}
            placeholder="Winery name"
            value={input2}
            onChangeText={(text) => {
                setInput2(text);
                if (error2) setError2(false);
              }}          />
          <TextInput
            style={[styles.input, error3 && styles.inputError]}
            placeholder="Vintage (year)"
            value={input3}
            onChangeText={(text) => {
                setInput3(text);
                if (error3) setError3(false);
              }}
          />
          <View style={styles.iosButtonGroup}>
            <Pressable
              style={[styles.iosButton, styles.iosDefaultButton]}
              onPress={() => handleSaveTask(input1, input2, input3, pendingTasks[0].memoryId , pendingTasks[0].fileName)} // Handle the task to be saved
            >
              <Text style={styles.iosButtonText}>Done</Text>
            </Pressable>
            <Pressable
              style={[styles.iosButton, styles.iosCancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.iosCancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
      </Modal>
      {/* </ImageBackground> */}
      </View>
  );
};

export default PendingTasksScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center", // Center content on top of the background
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputModal: {
    backgroundColor: "#f2f2f7ff",
    width: "80%",
    height: 240,
    borderRadius: 14,
    paddingTop: 14,
    alignItems: "center",
      justifyContent: "center",
  },
  inputModalTitleConatainer: {
    marginBottom: 14,
    height: 22,
  },
  inputModalTitle: {
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
    color: "#000000",
    lineHeight: 22,
  },
  input: {
    width: "90%",
    height: 30,
    borderWidth: 0.5,
    borderColor: "#3C3C434A",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "red",
  },
  iosButtonGroup: {
    width: "100%",
    marginTop: 8,
  },
  iosButton: {
    borderTopWidth: 0.33,
    borderColor: "#3C3C435C",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iosDefaultButton: {},
  iosCancelButton: {},
  iosButtonText: {
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.4,
    textAlign: "center",
    color: "#007AFF",
  },
  iosButtonText2: {
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: -0.4,
    textAlign: "center",
    color: "#007AFF",
  },
  iosCancelButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#007AFF",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  loaderBox: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: "#B3B3B3D1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
