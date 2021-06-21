import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {socket} from '../../action/ChatActions';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../action/authActions';
export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onLogin = () => {
    new Promise(function (res) {
      res(dispatch(login({email, password})));
    }).then(() => {
      socket.emit('getUsers');
    });
  };
  useEffect(() => {
    const {isAuthenticated, token} = auth;
    setToken(token);
    if (isAuthenticated) {
      navigation.navigate('Users');
    }
  }, [auth]);
  return (
    <View>
      <Text>Login</Text>
    </View>
  );
}
