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
    const [language, setLanguage] = useState(i18n.language);
    const [selectedlanguage, handleLanguage] = useState<"en" | "ja">("ja");

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
                        <Text style={styles.label}>EMAIL</Text>
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
                        <Text style={styles.label}>PASSWORD</Text>
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
                        <Text style={styles.label}>CONFIRM PASSWORD</Text>
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
                        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
});

export default SignUpScreen;
