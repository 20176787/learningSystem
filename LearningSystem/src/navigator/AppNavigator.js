import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeManager} from '../utils/themeManager';
import {DEFAULT_STYLES} from '../utils/styles';
import {NAV_TYPES} from '../utils/navTypes';

import OTPValidation from '../modules/login/OTPValidation';
import HomeScreen from '../modules/home/HomeScreen';
import LoginScreen from '../modules/login/LoginScreen';
import RegisterScreen from '../modules/login/RegisterScreen';
import ContactsView from '../modules/contacts/ContactsView';
import ChatRoomScreen from '../modules/chatroom/ChatRoomScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <View style={DEFAULT_STYLES.container}>
      <NavigationContainer theme={ThemeManager}>
        <Stack.Navigator
          initialRouteName={NAV_TYPES.LOGIN}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.LOGIN}
            component={LoginScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.REGISTER}
            component={RegisterScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.OTP}
            component={OTPValidation}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.HOME_SCREEN}
            component={HomeScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.CHAT_MESSAGE_SCREEN}
            component={ChatRoomScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name={NAV_TYPES.CONTACTS_SCREEN}
            component={ContactsView}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
