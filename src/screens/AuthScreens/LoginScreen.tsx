import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
  Pressable,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from 'react-redux';
import { setLoginUserId } from '../../../redux/actions';
import { supabase } from "../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginLogo from "../../../src/assets/svg/SvgCodeFile/LoginLogo";
import Ionicons from "react-native-vector-icons/Ionicons"; // For the eye icon
import { changeAppLanguage } from "../../../i18n";
import { useTranslation } from 'react-i18next';



type RootStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<TextInput>(null);
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ja">(i18n.language as "en" | "ja");

  const handleLanguageChange = async (language: "en" | "ja") => {
      setSelectedLanguage(language);
      await changeAppLanguage(language);
    };
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setSelectedLanguage(i18n.language as "en" | "ja");
       handleLanguageChange(i18n.language as "en" | "ja");
      });
    
      return unsubscribe;
    }, [navigation, i18n.language]);
  
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      Alert.alert(t("login_failed"), t(error.code),  
      [
          {
            text: t("ok"),
          }
        ]
      );
    } else if (data.user) {
      const UID = data.user.id;
      try {
        await AsyncStorage.setItem("UID", UID);
        await AsyncStorage.setItem("email", email);
        console.log("UID and email stored successfully:", UID, email);
      } catch (storageError) {
        console.error("Error storing UID and password:", storageError);
      }

      const userId = data.user.id;
      dispatch(setLoginUserId(userId));
    }
  };
  

  const isButtonDisabled = !(email && password);

  return (
    <View style={styles.maincontainer}>
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoContainer}>
        <LoginLogo />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("email")}</Text>
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("password")}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none" />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#A0A0A0" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isButtonDisabled || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t("logingin...") : t("login")}
          </Text>
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate("SignUpScreen")}>
          <Text style={styles.RegisterText}>{t("register")}</Text>
        </Pressable>
      </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 69,
    height: "100%",
    width: "100%",
  },
  maincontainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: "#A0A0A0",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#E0E0E0",
    borderBottomWidth: 1,
    fontSize: 12,
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
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
  RegisterText: {
    marginTop:10,
    color: '#A0A0A0',
  },
  BothlanguageContainer: {
    marginBottom: 150,
  
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
    justifyContent:"center",
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

    // Second shadow properties
    shadowOpacity: 0.31, // Opacity matching #0000001F (31% opacity)
    shadowRadius: 8, // Matching the second shadow blur radius of 8px
  },
  Text: {
    fontSize: 13,
    color: "#522F60",
    fontFamily: 'SF Pro',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default LoginScreen;
