import React from 'react';
import Providers from './navigation/index';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <MenuProvider>
      <Providers />
    </MenuProvider>
  );
}

export default App;