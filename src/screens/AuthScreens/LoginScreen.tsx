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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { getLoginUserId } from "../../../redux/actions";
import { supabase } from "../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginLogo from "../../../src/assets/svg/SvgCodeFile/LoginLogo";
import Ionicons from "react-native-vector-icons/Ionicons"; // For the eye icon

// Define the type for your navigation prop
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

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else if (data.user) {
      const UID = data.user.id;
      try {
        await AsyncStorage.setItem("UID", UID);
        console.log("UID stored successfully:", UID);
      } catch (storageError) {
        console.error("Error storing UID:", storageError);
      }

      // Dispatching the action with the correct user ID
      const userId = data.user.id;
      dispatch(getLoginUserId(userId));
    }
  };

  // Check if both email and password are filled
  const isButtonDisabled = !(email && password);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust this value based on your header height
    >
      <View style={styles.logoContainer}>
        <LoginLogo />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          ref={emailInputRef}
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
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#A0A0A0"
            />
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
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 70,
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
});

export default LoginScreen;
