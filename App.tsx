import React from 'react';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import AuthNavigation from './src/AuthNavigation/index';

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <AuthNavigation />
    </Provider>
  );
};

export default App;
