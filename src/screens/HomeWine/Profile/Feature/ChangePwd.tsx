import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient"; // Adjust import path as needed
import { err } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePwd = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation<NavigationProp<any>>();

    const passwordValidation = (password: string) => {
        const minLength = 6;
        const maxLength = 12;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /\d/;

        if (password.length < minLength) return `Password must be at least ${minLength} characters long`;
        if (password.length > maxLength) return `Password must not exceed ${maxLength} characters`;
        if (!specialCharRegex.test(password)) return "Password must contain at least one special character";
        if (!numberRegex.test(password)) return "Password must contain at least one number";
        return "";
    };

    const handleSavePassword = async () => {
        Alert.alert(
            "Change Password",
            "Are you sure",
            [
                {
                    text: "No",
                    onPress: () => {
                        // Navigate back if "No" is pressed
                        navigation.goBack();
                    },
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        const storedemail = await AsyncStorage.getItem("email");
                        console.log(storedemail);
                        if (newPassword !== confirmPassword) {
                            setError("Passwords do not match");
                            return;
                        }
                        const validationError = passwordValidation(newPassword);
                        if (validationError) {
                            setError(validationError);
                            return;
                        }
                        try {
                            const { error: updateError } = await supabase.auth.updateUser({
                                password: newPassword,
                            });
    
                            if (updateError) {
                                setError(updateError.message);
                                return;
                            }
                            Alert.alert("Success", "Your password has been updated!");
                            navigation.goBack();
                        } catch (error) {
                            setError("An error occurred while updating the password. Please try again.");
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };
    
    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (value !== newPassword) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    };

    const isTickDisabled = !newPassword || !confirmPassword || newPassword !== confirmPassword || oldPassword === newPassword;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
                <TouchableOpacity
                    style={[styles.CheckButton, isTickDisabled ? styles.disabledButton : null]}
                    onPress={handleSavePassword}
                    disabled={isTickDisabled}
                >
                    <Feather name="check" size={20} color={isTickDisabled ? "gray" : "black"} />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Old Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={[styles.input, error ? styles.errorInput : null]}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={(value) => {
                        setNewPassword(value);
                        if (confirmPassword && value !== confirmPassword) {
                            setError("Passwords do not match");
                        } else {
                            setError(""); // Clear error dynamically
                        }
                    }}
                    secureTextEntry
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={[styles.input, error ? styles.errorInput : null]}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                />
            </View>

            {/* Display error below New Password field */}
            {error && <Text style={styles.errorMessage}>{error}</Text>}
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
    disabledButton: {
        opacity: 0.5,
    },
    CheckButton: {
        justifyContent: "center",
        alignItems: "center",
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
    errorInput: {
        borderColor: "red",
    },
    errorMessage: {
        color: "red",
        fontSize: 12,
        marginBottom: 5,
    },
});

export default ChangePwd;
