import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
      <Text style={styles.title}>{t('settings')}</Text>
      <Text style={styles.label}>{t('change_language')}</Text>
      <Picker
        selectedValue={language}
        onValueChange={(value) => handleLanguageChange(value)}
        style={styles.picker}
      >
        <Picker.Item label={t('english')} value="en" />
        <Picker.Item label={t('japanese')} value="ja" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: 200,
    height: 50,
  },
});

export default WineDashboard;
