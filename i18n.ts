import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './src/locales/en.json';
import ja from './src/locales/ja.json';

const LANGUAGE_KEY = 'appLanguage';

// Load the saved language or default to 'ja' (Japanese)
const loadLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  return savedLanguage || 'ja'; // Default to 'ja' if no language is set
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: 'ja', // Initial language (will be overridden later)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
    react: {
      useSuspense: false,
    },
  });

// Set the language on app startup
loadLanguage().then((lang) => i18n.changeLanguage(lang));

export const changeAppLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
};

export default i18n;
