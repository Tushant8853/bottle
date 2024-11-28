import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { setLoginUserId } from '../../../redux/actions';
import { supabase } from '../../../backend/supabase/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginLogo from '../../../src/assets/svg/SvgCodeFile/LoginLogo';
import { changeAppLanguage } from "../../../i18n";
import { useTranslation } from 'react-i18next';

// Define navigation types
type RootStackParamList = {
    Home: undefined;
    LoginScreen: undefined;
};
type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const emailInputRef = useRef<TextInput>(null);
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ja">(i18n.language as "en" | "ja");

    const handleLanguageChange = async (language: "en" | "ja") => {
        setSelectedLanguage(language);
        await changeAppLanguage(language);
    };

    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
            return;
        }

        setLoading(true);
        const { error, data } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) {
            Alert.alert(
                t("sign_up_failed"),
                t(error.code),
                [
                    {
                        text: t("ok"),
                    }
                ]
            );
        } else if (data.user) {
            const UID = data.user.id;
            try {
                await AsyncStorage.setItem('UID', UID);
                const userId = data.user.id;
                dispatch(setLoginUserId(userId));
                console.log(' UID after signup ---', UID);
            } catch (storageError) {
                console.error('Error storing UID:', storageError);
            }
        }
    };

    const isButtonDisabled = !(email && password && confirmPassword);

    return (
        <View style={styles.Maincontainer}>
            <KeyboardAvoidingView
                style={styles.container}
            >
                <View style={styles.logoContainer}>
                    <LoginLogo />
                </View>

                {/* Email, Password, and Confirm Password Input Fields */}
                <View style={styles.MaininputContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("email")}</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("password")}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, { width: '90%' }]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                textContentType="password"
                                autoCapitalize="none"

                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#A0A0A0" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("confirmpassword")}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, { width: '90%' }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                textContentType="password"
                                autoCapitalize="none"
                                keyboardType="default"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#A0A0A0" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Signup Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={isButtonDisabled || loading}
                    >
                        <Text style={styles.buttonText}>{loading ? t("signing_up...") : t("signup")}</Text>
                    </TouchableOpacity>
                </View>
                <Pressable onPress={() => navigation.navigate("LoginScreen")}>
                    <Text style={styles.RegisterText}>{t("login")}</Text>
                </Pressable>
            </KeyboardAvoidingView>
            <View style={styles.BothlanguageContainer}>
                <View style={styles.ToggleContainer}>
                    <View style={styles.englishContainer}>
                        <Pressable
                            style={[
                                styles.englishToggleButton,
                                selectedLanguage === "en" && styles.selectedButton,
                            ]}
                            onPress={() => handleLanguageChange("en")}
                        >
                            <Text
                                style={[
                                    styles.Text,
                                    selectedLanguage === "en" && styles.selectedText,
                                ]}
                            >{"English"}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.japaneseContainer}>
                        <Pressable
                            style={[
                                styles.japaneseToggleButton,
                                selectedLanguage === "ja" && styles.selectedButton,
                            ]}
                            onPress={() => handleLanguageChange("ja")}
                        >
                            <Text
                                style={[
                                    styles.Text,
                                    selectedLanguage === "ja" && styles.selectedText,
                                ]}
                            >{"日本語"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: '#fff',

    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 60,
        marginTop: 80,
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    selectedText:{},
    ////////////////////////////////////////////
    MaininputContainer: {
        width: '100%',
        // borderWidth:1,
    },
    inputContainer: {
        marginBottom: 15,
        // borderWidth:1,
    },
    label: {
        // borderWidth:1,
        fontSize: 12,
        color: "#A0A0A0",
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#D1D1D1',
        borderBottomWidth: 1,
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        height: 40,
        borderColor: '#D1D1D1',
        borderBottomWidth: 1,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 30,
    },
    button: {
        height: 50,
        width: "50%",
        backgroundColor: "#522F60",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
    disabledButton: {
        backgroundColor: "#A0A0A0",
    },
    buttonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    BothlanguageContainer: {
        marginBottom: 150,
        justifyContent: "center",
        alignItems: "center",
    },
    ToggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 39,
        marginHorizontal: 30,
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 8,
        width: 200,
        backgroundColor: '#F3F3F3',
    },
    englishContainer: {
        alignSelf: "center",
        justifyContent: "center",
        marginLeft: 4,
        flex: 1,
    },
    japaneseContainer: {
        alignSelf: "center",
        flex: 1,
        marginRight: 4,
    },
    englishToggleButton: {
        height: 28,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 7,
    },
    japaneseToggleButton: {
        height: 28,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 7,
    },
    selectedButton: {
        backgroundColor: "white",
        shadowColor: '#000', // The color of the shadow
        shadowOffset: { width: 0, height: 3 }, // X and Y offset
        shadowOpacity: 0.1, // Opacity matching #0000000A
        shadowRadius: 1, // Matching the first shadow blur radius of 1px

        // Elevation for Android
        elevation: 3, // Creates the shadow effect in Android (approximation of 3px shadow)
    },
    Text: {
        fontSize: 13,
        color: "#522F60",
        fontFamily: 'SF Pro',
        fontWeight: '500',
        lineHeight: 18,
        textAlign: 'center',
    },
    RegisterText: {
        marginTop:10,
        color: '#A0A0A0',
      },
});

export default SignUpScreen;
