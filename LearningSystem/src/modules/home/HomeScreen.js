import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import HomeHeader from './HomeHeader';
import {DEFAULT_STYLES} from '../../utils/styles';
import {
  WHITE,
  TEXT_SUBTITLE,
  BLACK,
  GREEN,
  TEXT_TITLE,
} from '../../utils/colors';
import TabView from './TabView';
import {SafeAreaView} from 'react-native-safe-area-context';
import handleAppStateChange, {
  sendPageLoadStatus,
} from '../../utils/UserAppStateDetector';

const HomeScreen = ({children, style, navigation, ...rest}) => {
  useEffect(() => {
    registerStateChangeListener();
    sendPageLoadStatus();

    return () => {
      // Clean up the subscription
      unRgisterStateChangeListener();
    };
  }, []);

  function registerStateChangeListener() {
    AppState.addEventListener('change', handleAppStateChange);
  }

  function unRgisterStateChangeListener() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  return (
    <SafeAreaView style={DEFAULT_STYLES.container}>
      <View style={DEFAULT_STYLES.container}>
        <HomeHeader navigation={navigation} />
        <TabView navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

var styles = StyleSheet.create({
  headerStyle: {
    width: '100%',
    height: '11%',
    backgroundColor: WHITE,
  },
  tabStyle: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    elevation: -100,
    shadowOpacity: 0,
  },
  tabTextStyle: {
    color: TEXT_TITLE,
    fontWeight: 'bold',
  },
});
