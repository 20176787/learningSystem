import React, {useMemo, useState, useRef, useEffect} from 'react';
import {Text, View, FlatList, SafeAreaView} from 'react-native';
import _Divider from '../../components/_Divider';

import ChatRoomLeftItem from './ChatRoomLeftItem';
import ChatRoomRightItem from './ChatRoomRightItem';
import constants from '../../utils/constants';
import ChatTextInput from './ChatTextInput';
import {
  getChatRoom,
  createChatRoom,
  updateChatRoom,
} from '../../api/apiController';
import moment from 'moment';
import {
  getLocalData,
  getUserType,
  getUserTypeChatRoom,
  getSocket,
} from '../../utils/helperFunctions';
import {getChatRoomChatModel} from '../../utils/helperModels';
import RNFetchBlob from 'rn-fetch-blob';
import io from 'socket.io-client';
var socket = getSocket();

const ChatRoomView = ({chatItem, navigation, isNewChat}) => {
  const [chatRoomList, setChatRoomList] = useState([]);
  const [userId, setUserId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomChatItem, setRoomChatItem] = useState('');
  const flatList = useRef();
  const token = getLocalData(constants.ACCESS_TOKEN);
  useEffect(() => {
    getUser();
    listenSocket();
    const socketTest = io(constants.SOCKET_URL);
    console.log(12345);
    socketTest.on(constants.CHAT_LIST, msg => {
      console.log('msg', msg);
    });
  }, []);

  useEffect(() => {
    if (userId != '') {
      const req = JSON.stringify({
        roomId: chatItem.roomId,
        userId: userId,
      });
      console.log('123', req, chatItem);
      getLocalData(constants.ACCESS_TOKEN).then(res => {
        console.log(res);
        RNFetchBlob.fetch(
          'POST',
          constants.API.SERVER_URL + constants.API.CHAT_ROOM,
          {
            Authorization: res,
            'Content-Type': 'application/json',
          },
          req,
        )
          .then(res => {
            console.log('RESPONSE => ', res);
            if (res.data && JSON.parse(res.data).data.length > 0) {
              var chatArray = JSON.parse(res.data).data[0].chat;
              chatArray.reverse();
              setChatRoomList(chatArray);
            }
          })
          .catch(error => {
            console.log('ERROR ', error);
          });
      });
    }
  }, [chatItem.roomId, userId]);

  useEffect(() => {
    // console.log('Chat List Changed == ', JSON.stringify(chatList));
    if (roomChatItem != '') {
      renderChats();
    }
  }, [roomChatItem]);

  async function getUser() {
    const userId = await getLocalData(constants.USER_ID);
    setUserId(userId);
  }

  function listenSocket() {
    socket.removeAllListeners();
    socket.on(constants.CHAT_ROOM, msg => {
      console.log('Message Received => ', JSON.stringify(msg));
      setRoomChatItem(msg);
    });
  }

  function renderChats() {
    let chatArray = chatRoomList;
    // If message received invloves user then only add to list else ignore
    if (roomChatItem.userId === userId || roomChatItem.chatId === userId) {
      setRefresh(true);
      if (!chatArray) {
        chatArray = [];
      }
      chatArray.reverse();
      chatArray.push(roomChatItem.chat);
      chatArray.reverse();
      // console.log('USER ID => ', userId);
      setChatRoomList(chatArray);
      setTimeout(() => {
        setRefresh(false);
      }, 1000);
    }
  }

  const onSendMessage = text => {
    if (text != '') {
      isNewChat = chatRoomList.length === 0 ? true : false;
      let chatRequest = getChatRoomChatModel(chatItem, isNewChat, userId, text);
      console.log(123);
      socket.emit(constants.CHAT_ROOM, chatRequest);
      chatRequest.chatUnreadCount = {
        userId: userId,
        type: 'add',
        count: 1,
      };

      if (chatRequest.roomId === '') {
        chatRequest.roomId = roomId;
      }

      const res = isNewChat
        ? createChatRoom(chatRequest)
        : updateChatRoom(chatRequest);
      res
        .then(res => {
          console.log('CHAT ROOM RESPONSE=> ', JSON.stringify(res.data));
          chatRequest.roomId = res.data.id;
          setRoomId(chatRequest.roomId);
          socket.emit(constants.CHAT_LIST, chatRequest);
        })
        .catch(err => {
          console.log('CHAT ROOM ERROR => ', JSON.stringify(err));
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingTop: 4}}>
        <FlatList
          ref={flatList}
          extraData={refresh}
          inverted={true}
          style={{paddingTop: 0, paddingBottom: 0}}
          data={chatRoomList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            let userType = getUserTypeChatRoom(item, userId);
            if (userType === constants.OWNER) {
              return <ChatRoomRightItem item={item} navigation={navigation} />;
            } else {
              return <ChatRoomLeftItem item={item} navigation={navigation} />;
            }
          }}
        />
        <ChatTextInput onSendMessage={text => onSendMessage(text)} />
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomView;
