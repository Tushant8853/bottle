import React from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import AuthNavigation from './src/AuthNavigation/index';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

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
