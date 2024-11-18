import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../../i18n';

const WineDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await changeAppLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>
      <Text style={styles.label}>{'change_language'}</Text>
      <Picker
        selectedValue={language}
        onValueChange={(value) => handleLanguageChange(value)}
        style={styles.picker}
      >
        <Picker.Item label={'English'} value="en" />
        <Picker.Item label={t('japanese')} value="ja" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  picker: {
    marginTop: 0,
    width: 150,
    //height: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    width: '100%'
  },
});

export default WineDashboard;
