import React from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import {StatusBar, View, Platform} from 'react-native';
import {GREEN} from './src/utils/colors';
console.disableYellowBox = true;
const App = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      {Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor: GREEN,
            height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
          }}>
          <StatusBar barStyle="light-content" backgroundColor={GREEN} />
        </View>
      )}
      {Platform.OS === 'android' && (
        <StatusBar barStyle="light-content" backgroundColor={GREEN} />
      )}
      <AppNavigator />
    </View>
  );
};
export default App;
