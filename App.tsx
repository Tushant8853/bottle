// App.tsx
import React, { useEffect } from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import AuthNavigation from './src/AuthNavigation/index';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import * as Sentry from '@sentry/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';

Sentry.init({
  dsn: 'https://4bec940f9a904ba637fe15049cc8c121@o4508476869640192.ingest.us.sentry.io/4508476887662592',
});

const linkingConfig = {
  prefixes: ['bottleshock://app', 'https://www.bottleshock.wine/app'],
  config: {
    screens: {
      LoginScreen: '/login',
      SignUpScreen: '/signup',
      StoriesList: '/story',
      StoriesDetail: '/story/:id',
      RestaurantsList: '/restaurantslist',
      Home: '/home',
      Profile: '/profile',
    },
  },
};

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
      console.log('Deep Link Event URL:', event.url);
      // Optionally send this event to Sentry for monitoring
      Sentry.captureMessage(`Deep Link Event URL: ${event.url}`);
    };

    const subscription = Linking.addEventListener('url', handleLinkEvent);
    handleInitialLink();

    return () => {
      subscription.remove(); // Unsubscribe from events
    };
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer linking={linkingConfig}>
          <AuthNavigation />
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  );
};

export default App;