import axios from 'axios';
import constants from '../utils/constants';
import {getLocalData} from '../utils/helperFunctions';
import RNFetchBlob from 'rn-fetch-blob';
const api = axios.create({
  baseURL: constants.API.SERVER_URL,
});
const token = getLocalData(constants.ACCESS_TOKEN);
export const getChatList = () => {
  return api.get(constants.API.CHAT_LIST);
};
export const getChatRoom = payload => {
  return api.post(constants.API.CHAT_ROOM, payload);
};
export const createChatRoom = payload => {
  console.log('create new chat room');
  return api.post(constants.API.CREATE_CHAT_ROOM, payload);
};
export const updateChatRoom = payload => {
  return api.post(constants.API.UPDATE_CHAT_ROOM, payload);
};

export const loginUser = payload => {
  return RNFetchBlob.fetch(
    'POST',
    constants.API.SERVER_URL + constants.API.LOGIN_USER,
    {
      Authorization: token,
      // more headers  ..
    },
    JSON.stringify(payload),
  );
  // return api.post(constants.API.LOGIN_USER, payload);
};

export const getLoggedInUserList = payload => {
  return api.get(constants.API.USER_LIST, payload);
};

export const getLastSeenUser = payload => {
  return api.post(constants.API.LAST_SEEN, payload);
};

export const createUserStatus = payload => {
  return api.post(constants.API.CREATE_USER_STATUS, payload);
};

export const getAllUserStatus = () => {
  return api.get(constants.API.GET_ALL_STATUS);
};

export const setUserStatusViewedForID = payload => {
  return api.post(constants.API.SET_STATUS_VIEWED, payload);
};
