import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute, NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../../TabNavigation/navigationTypes";
import { supabase } from "../../../../../../../backend/supabase/supabaseClient";
import { useTranslation } from 'react-i18next';


const EditMyMemories = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const { id } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();


  const [memory, setMemory] = useState({
    name: "",
    short_description: "",
    description: "",
  });

  const fetchMemories = async () => {
    try {
      const { data: memoriesData, error } = await supabase
        .from("bottleshock_memories")
        .select("id, user_id, name, description, short_description")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching memories:", error.message);
        return;
      }

      if (memoriesData) {
        setMemory({
          name: memoriesData.name || "",
          short_description: memoriesData.short_description || "",
          description: memoriesData.description || "",
        });
      }
    } catch (err) {
      console.error("Error fetching memories:", err);
    }
  };

  // Use useFocusEffect to reload data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchMemories();
    }, [id])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.Backbotton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editmymemory')}</Text>
      </View>

      {/* Fields */}
      <View style={styles.fieldsContainer}>
        {["name", "short_description", "description"].map((field) => (
          <TouchableOpacity
            key={field}
            style={styles.field}
            onPress={() =>
              navigation.navigate("EditMemoryField", {
                id,
                field,
                value: memory[field as keyof typeof memory],
              })
            }
          >
            <Text style={styles.label}>{field.replace("_", " ")}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {memory[field as keyof typeof memory]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default EditMyMemories;

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
  fieldsContainer: {
    marginTop: 1,
    marginHorizontal: 16,
  },
  field: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  label: {
    fontFamily: "Hiragino Sans",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.02,
    color: "#522F60",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
