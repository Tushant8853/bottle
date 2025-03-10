// App.tsx
import React, { useEffect,useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import * as Sentry from '@sentry/react-native';
import { Linking } from 'react-native';
import AuthNavigation from './src/AuthNavigation/index';
import { uploadImagesToS3 } from './src/screens/HomeMe/Upload/Upload_S3';
import * as Location from 'expo-location';
Sentry.init({
  dsn: 'https://4bec940f9a904ba637fe15049cc8c121@o4508476869640192.ingest.us.sentry.io/4508476887662592',
});

const App: React.FC = () => {
  useEffect(() => {
    const handleInitialLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Initial URL:', initialUrl);
        }
      } catch (error) {
        console.error('Error fetching initial URL:', error);
      }
    };

    const handleLinkEvent = (event: { url: string }) => {
      Sentry.captureMessage(`Deep Link Event URL: ${event.url}`);
    };

    const subscription = Linking.addEventListener('url', handleLinkEvent);
    handleInitialLink();

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    uploadImagesToS3();
  }, []);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
      } else {
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthNavigation />
      </I18nextProvider>
    </Provider>
  );
};

export default App;
