import React from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import AuthNavigation from './src/AuthNavigation/index';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4bec940f9a904ba637fe15049cc8c121@o4508476869640192.ingest.us.sentry.io/4508476887662592',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
        <AuthNavigation />
      </I18nextProvider>
    </Provider>
  );
};

export default App;
