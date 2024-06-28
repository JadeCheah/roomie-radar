import React from 'react';
import Providers from './navigation/index';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <MenuProvider>
      <Providers />
    </MenuProvider>
  );
  //return <Providers />
}

export default App;