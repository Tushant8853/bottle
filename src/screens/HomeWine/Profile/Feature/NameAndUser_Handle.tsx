import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../../backend/supabase/supabaseClient";
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from "@react-navigation/native";

const NameAndUser_Handle = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [inputValue, setInputValue] = useState(""); // Store the user handle here
    const [userHandle, setUserHandle] = useState(""); // This will hold the fetched user handle
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Track if the button should be disabled
    const { t } = useTranslation();

    useEffect(() => {
        fetchUID();
    }, []);

    useEffect(() => {
        // Pass `handleSave` and `isButtonDisabled` to `route.params`
        navigation.setParams({
            handleSave,
            isButtonDisabled,
        });
    }, [isButtonDisabled, inputValue]);

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
                    setIsButtonDisabled(true); // Disable button if no change
                } else {
                    setInputValue("");
                    setIsButtonDisabled(false); // Enable button if handle is empty
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

    const handleInputChange = (text) => {
        setInputValue(text);
        setIsButtonDisabled(text.trim() === userHandle.trim()); // Disable button if the handle is unchanged
    };

    return (
        <View style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>{t('userhandle')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={userHandle ? userHandle : "Please enter a new user handle"}
                    value={inputValue}
                    onChangeText={handleInputChange}
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
