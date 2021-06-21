import React, {useMemo, useState, useReducer} from 'react';
import {Text, View, FlatList, Image, StyleSheet} from 'react-native';
import ChatListItem from './ChatListItem';
import _Divider from '../../components/_Divider';

import constants from '../../utils/constants';
import {Button} from 'native-base';
import {WHITE, LIGHT_GREEN} from '../../utils/colors';
import CHAT from '../../../assets/images/chat.png';
import {NAV_TYPES} from '../../utils/navTypes';
import EmptyComponent from '../../components/EmptyComponent';
import {getChatList} from '../../api/apiController';
import {useEffect} from 'react';
import {
  getLocalData,
  getUserType,
  getSocket,
} from '../../utils/helperFunctions';
import {
  initialChatListState,
  chatListReducer,
  CHAT_LIST,
  CHAT_ITEM,
  REFRESH,
} from './ChatListReducer';
import {useFocusEffect} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

var socket = getSocket();
const token = getLocalData(constants.ACCESS_TOKEN);
const ChatListView = ({navigation}) => {
  var [state, dispatch] = useReducer(chatListReducer, initialChatListState);
  var {chatList, chatItem, refresh, userId} = state;

  useFocusEffect(
    React.useCallback(() => {
      getLatestChats();
    }, []),
  );

  useEffect(() => {
    listenSocket();
  }, []);
  useEffect(() => {
    console.log('Chat List Changed == ', JSON.stringify(chatList));
    if (chatItem != '') {
      renderChats();
    }
  }, [chatItem]);

  async function getUserId() {
    const userId = await getLocalData(constants.USER_ID);
    dispatch({type: constants.USER_ID, payload: userId});
    return userId;
  }
  const getLatestChats = async () => {
    await getUserId();
    getLocalData(constants.USER_ID).then(userId => {
      getLocalData(constants.ACCESS_TOKEN).then(res => {
        let dataSend = JSON.stringify({
          id: userId,
        });
        console.log(1, dataSend);
        RNFetchBlob.fetch(
          'POST',
          constants.API.SERVER_URL + constants.API.CHAT_LIST,
          {
            Authorization: res,
            'Content-Type': 'application/json',
          },
          dataSend,
        )
          .then(res => {
            console.log('RESPONSE => ', JSON.parse(res.data));
            dispatch({type: CHAT_LIST, payload: JSON.parse(res.data).data});
            dispatch({type: REFRESH, payload: false});
          })
          .catch(error => {
            console.log('ERROR ', error);
          });
      });
    });
  };

  async function renderChats() {
    let chatArray = chatList;
    console.log('Message CHAT Received => ', JSON.stringify(chatItem));

    var isMatch = false;
    if (chatArray.length > 0) {
      for (let i = 0; i < chatArray.length; i++) {
        const element = chatArray[i];
        if (chatItem && element.roomId === chatItem.roomId) {
          // Increment unread count
          chatItem = await calcUnreadCount(chatItem, element.chatUnreadCount);
          chatItem.chat = [chatItem.chat];
          // }
          console.log('Selected Chat Received => ', JSON.stringify(chatItem));
          chatArray[i] = chatItem;
          isMatch = true;
          break;
        }
      }

      if (!isMatch && chatItem.chatUnreadCount.type != 'reset') {
        chatItem = await calcUnreadCount(chatItem, 0);
        chatItem.chat = [chatItem.chat];
        console.log('Selected Chat Received => ', JSON.stringify(chatItem));
        chatArray.push(chatItem);
      }

      console.log('Message CHAT AFTER Received => ', JSON.stringify(chatItem));

      dispatch({type: CHAT_LIST, payload: chatArray});
      console.log(
        `FINAL CHAT ARRAY ${refresh} => `,
        'JSON.stringify(chatArray)',
      );
    } else {
      // For new chat
      if (chatItem.chatUnreadCount.type === 'add') {
        dispatch({type: REFRESH, payload: true});
      }
    }
  }

  function listenSocket() {
    socket.on(constants.CHAT_LIST, chatItem => {
      dispatch({type: CHAT_ITEM, payload: chatItem});
    });
  }
  function calcUnreadCount(chatItem, originalCount) {
    // const userId = await getLocalData(constants.USER_ID);
    if (chatItem.chatUnreadCount.userId != userId) {
      if (chatItem.chatUnreadCount.type === 'reset') {
        chatItem.chatUnreadCount = 0;
      } else if (chatItem.chatUnreadCount.type === 'add') {
        chatItem.chatUnreadCount = originalCount ? originalCount + 1 : 1;
      } else {
        chatItem.chatUnreadCount = 0;
      }
    } else if (chatItem.chatUnreadCount.type === 'reset') {
      chatItem.chatUnreadCount = 0;
    } else {
      chatItem.chatUnreadCount = originalCount;
    }
    return chatItem;
  }

  return (
    <View style={{flex: 1}}>
      {chatList && chatList.length === 0 && (
        <EmptyComponent message={'No Chats Found'} />
      )}
      <FlatList
        data={chatList}
        extraData={refresh}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
          return <_Divider />;
        }}
        renderItem={({item, index}) => {
          return (
            <ChatListItem item={item} navigation={navigation} userId={userId} />
          );
        }}
      />
      <Button
        active={true}
        rounded
        style={styles.btnView}
        onPress={() =>
          navigation.navigate(NAV_TYPES.CONTACTS_SCREEN, {chatList})
        }>
        <Image
          source={require('../../../assets/images/chat.png')}
          style={styles.thumbView}
        />
      </Button>
    </View>
  );
};

export default ChatListView;

const styles = StyleSheet.create({
  btnView: {
    marginTop: 15,
    marginRight: -5,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: LIGHT_GREEN,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  thumbView: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    tintColor: WHITE,
  },
});
