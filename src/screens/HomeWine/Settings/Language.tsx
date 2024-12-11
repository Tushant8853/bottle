import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../../../i18n';
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const Language: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await changeAppLanguage(lang);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.lancontainer}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={styles.radioButtonContainer}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <Text style={styles.radioLabel}>{lang.label}</Text>
          <View style={[styles.radioCircle, language === lang.code && styles.selectedRadio]} /> 
        </TouchableOpacity>
      ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 1,
    paddingTop: 55,
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    flex: 1,
  },
  Backbotton: {},
  lancontainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,

  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  radioLabel: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedRadio: {
    backgroundColor: '#000',
  },

});

export default Language;
