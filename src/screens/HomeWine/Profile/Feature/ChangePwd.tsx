import React, { useState ,useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../../../../backend/supabase/supabaseClient"; // Adjust import path as needed
import { err } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';


const ChangePwd = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState(""); // Added error state for old password
    const navigation = useNavigation<NavigationProp<any>>();
    const { t } = useTranslation();


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
    useEffect(() => {
        const isTickDisabled =
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword ||
            oldPassword === newPassword;

        // Update route params with state and handler
        navigation.setParams({
            isTickDisabled,
            handleSavePassword,
        });
    }, [oldPassword, newPassword, confirmPassword]);
    const handleSavePassword = async () => {
        const storedEmail = await AsyncStorage.getItem("email");
        console.log(storedEmail);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const validationError = passwordValidation(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: storedEmail ?? "",
            password: oldPassword,
        });

        if (signInError || !data.user) {
            setOldPasswordError("Old password is incorrect"); // Set error for old password
            return;
        }

        setOldPasswordError(""); // Clear old password error if login is successful

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            navigation.goBack();
        } catch (error) {
            setError("An error occurred while updating the password. Please try again.");
            console.log(error);
        }
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

            <View style={styles.formGroup}>
                <Text style={styles.label}>{t('oldpassword')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('enteroldpassword')}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                />
            </View>
            {oldPasswordError && <Text style={styles.errorMessage}>{oldPasswordError}</Text>}

            <View style={styles.formGroup}>
                <Text style={styles.label}>{t('newpassword')}</Text>
                <TextInput
                    style={[styles.input, error ? styles.errorInput : null]}
                    placeholder={t('enternewpassword')}
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
                <Text style={styles.label}>{t('confirmnewpassword')}</Text>
                <TextInput
                    style={[styles.input, error ? styles.errorInput : null]}
                    placeholder={t('confirmnewpassword')}
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
