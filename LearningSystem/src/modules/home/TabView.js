import React from 'react';
import {StyleSheet} from 'react-native';
import {Container, Tab, Tabs, TabHeading, Text} from 'native-base';
import {WHITE, GREEN} from '../../utils/colors';
import ChatListView from '../chat/ChatListView';
// import ChatListView from '../chat/ChatListView';
// import StatusView from '../status/StatusView';
const TabView = ({navigation}) => (
  <Container>
    <Tabs
      initialPage={0}
      style={{elevation: 0, marginTop: -25}}
      tabContainerStyle={{
        elevation: 0,
        height: '8%',
      }}
      tabBarUnderlineStyle={{
        height: 2,
        backgroundColor: WHITE,
      }}>
      <Tab
        heading={
          <TabHeading style={styles.tabStyle}>
            <Text uppercase style={styles.tabTextStyle}>
              Chats
            </Text>
          </TabHeading>
        }>
        <ChatListView navigation={navigation} />
      </Tab>
      <Tab
        heading={
          <TabHeading style={styles.tabStyle}>
            <Text uppercase style={styles.tabTextStyle}>
              Lessons
            </Text>
          </TabHeading>
        }>
        {/*<StatusView navigation={navigation} />*/}
      </Tab>
    </Tabs>
  </Container>
);

export default TabView;

var styles = StyleSheet.create({
  headerStyle: {
    width: '100%',
    height: '11%',
    backgroundColor: WHITE,
  },
  tabStyle: {
    flexDirection: 'row',
    elevation: -100,
    shadowOpacity: 0,
    backgroundColor: GREEN,
  },
  tabTextStyle: {
    color: WHITE,
    fontWeight: 'bold',
  },
});
