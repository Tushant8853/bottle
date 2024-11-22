import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../backend/supabase/supabaseClient";

const NameAndUser_Handle = () => {
    const navigation = useNavigation();
    const [inputValue, setInputValue] = useState("");  // Store the user handle here
    const [userHandle, setUserHandle] = useState("");  // This will hold the fetched user handle
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);  // Track if the button should be disabled

    useEffect(() => {
        fetchUID();
    }, []);

    const fetchUID = async () => {
        try {
            const storedUID = await AsyncStorage.getItem("UID");
            if (storedUID) {
                const { data, error } = await supabase
                    .from("bottleshock_users")
                    .select("handle")
                    .eq("id", storedUID)
                    .single();

                if (error) {
                    console.error("Error fetching user handle:", error.message);
                    Alert.alert("Error", "Failed to fetch user handle");
                    return;
                }
                if (data?.handle) {
                    setUserHandle(data.handle);
                    setInputValue(data.handle);
                    setIsButtonDisabled(true);  // Disable button if no change
                } else {
                    setInputValue("");
                    setIsButtonDisabled(false);  // Enable button if handle is empty
                }
            } else {
                console.error("UID is missing from AsyncStorage");
                Alert.alert("Error", "UID is missing");
            }
        } catch (error) {
            console.error("Error retrieving UID from AsyncStorage", error);
            Alert.alert("Error", "An error occurred while fetching the UID");
        }
    };

    const handleSave = async () => {
        if (!inputValue.trim()) {
            Alert.alert("Validation", "Please enter a new user handle");
            return;
        }
        if (inputValue !== userHandle) {
            try {
                const storedUID = await AsyncStorage.getItem("UID");
                const { error } = await supabase
                    .from("bottleshock_users")
                    .update({ handle: inputValue })
                    .eq("id", storedUID);

                if (error) {
                    console.error("Error saving new handle:", error.message);
                    Alert.alert("Error", "Failed to save the new handle");
                } else {
                    setUserHandle(inputValue);
                    navigation.goBack();
                }
            } catch (error) {
                console.error("Error saving user handle:", error);
                Alert.alert("Error", "An error occurred while saving the handle");
            }
        } else {
            Alert.alert("No Change", "The user handle is already the same");
        }
    };

    const handleInputChange = (text: string) => {
        setInputValue(text);
        setIsButtonDisabled(text.trim() === userHandle.trim());  // Disable button if the handle is unchanged
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Handle</Text>
                <TouchableOpacity
                    style={[styles.CheckButton, isButtonDisabled && styles.disabledButton]}  // Disable button style
                    onPress={handleSave}
                    disabled={isButtonDisabled}
                >
                    <Feather name="check" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>User Handle</Text>
                <TextInput
                    style={styles.input}
                    placeholder={userHandle ? userHandle : "Please enter a new user handle"}
                    value={inputValue}
                    onChangeText={handleInputChange}  // Update the handleInputChange function
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        paddingHorizontal: 16,
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
        flex: 1,
    },
    CheckButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.5,
    },
    formGroup: {
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
    },
});

export default NameAndUser_Handle;
