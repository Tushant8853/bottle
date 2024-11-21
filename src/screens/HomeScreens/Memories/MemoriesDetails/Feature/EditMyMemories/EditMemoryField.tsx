import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import Icon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

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

      navigation.goBack();  // Return to the previous screen
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit {field.replace("_", " ")}</Text>
        <TouchableOpacity
          style={[
            styles.CheckButton,
            input === value ? styles.disabledButton : null, // Apply disabled style when unchanged
          ]}
          onPress={saveField}
          disabled={input === value} // Disable button if no changes
        >
          <Feather name="check" size={20} color={input === value ? "#ccc" : "black"} />
        </TouchableOpacity>

      </View>


      <View style={styles.TextInputContainer} >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput} // Automatically updates input state
          multiline={field === "description" || field === "short_description"}
        />
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
    justifyContent: "space-between", // Distributes items evenly
    height: 60,
    paddingHorizontal: 16, // Adds padding for spacing on left and right
    marginTop: 30,
  },
  BackButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flex: 1, // Occupies remaining space between BackButton and CheckButton
  },
  disabledButton: {
    opacity: 0.5, // Makes the button appear inactive
  },
  CheckButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: "Hiragino Sans",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.02,
    color: "#522F60",
  },
  TextInputContainer: {
    marginHorizontal: 16,
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
    alignSelf: 'center',
    backgroundColor: "#522F60",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    width: '30%'
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
