import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import Icon from "react-native-vector-icons/FontAwesome";

const EditMemoryField = () => {
  const route = useRoute<RouteProp<{ params: { id: string; field: string; value: string } }, "params">>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { id, field, value } = route.params;

  const [input, setInput] = useState(value);

  const saveField = async () => {
    try {
      const { error } = await supabase
        .from("bottleshock_memories")
        .update({ [field]: input })
        .eq("id", id);

      if (error) {
        console.error("Error saving field:", error.message);
        return;
      }

      alert(`${field.replace("_", " ")} updated successfully!`);
      navigation.navigate("Dashboard");  // Return to the previous screen
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.Backbotton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit {field.replace("_", " ")}</Text>
      </View>

      <View style={styles.TextInputContainer} >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          multiline={field === "description" || field === "short_description"}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveField}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default EditMemoryField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginTop: 30,
  },
  Backbotton: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  label: {
    fontFamily: "Hiragino Sans",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.02,
    color: "#522F60",
  },
  TextInputContainer:{
    marginHorizontal:16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  saveButton: {
    alignSelf:'center',
    backgroundColor: "#522F60",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    width:'30%'
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
