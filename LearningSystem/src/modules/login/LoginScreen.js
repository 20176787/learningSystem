import React, {Component, useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {DEFAULT_STYLES} from '../../utils/styles';
import {GREEN, WHITE, TEXT_SUBTITLE, GRAY, MID_GREEN} from '../../utils/colors';
import {Icon, Button, Root, Text} from 'native-base';
import _Text from '../../components/_Text';
import _TextInput from '../../components/_TextInput';
import {NAV_TYPES} from '../../utils/navTypes';
import {
  showToast,
  getUniqueId,
  getLocalData,
  storeLocalData,
} from '../../utils/helperFunctions';
import constants from '../../utils/constants';
import {getLoginModel} from '../../utils/helperModels';

import {StackActions} from '@react-navigation/native';
import {loginUser} from '../../api/apiController';
import {BorderlessButton} from 'react-native-gesture-handler';
import LoadingComponent from '../../components/LoadingComponent';
import RNFetchBlob from 'rn-fetch-blob';

var {container, poppinsSemiBold, poppinsRegular, poppinsMedium} =
  DEFAULT_STYLES;

const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getLocalData(constants.USER_ID)
      .then(userID => {
        console.log('Login userID => ', userID);
        if (userID && userID != null && userID != '') {
          navigation.dispatch(StackActions.replace(NAV_TYPES.HOME_SCREEN));
        }
      })
      .catch(err => {
        console.log('Login Error => ', err);
      });
  }, []);

  const onLoginClick = () => {
    if (userName === '' || userName === null) {
      showToast({text: 'Enter your Email', type: 'danger'});
    } else if (password === '' || password === null) {
      showToast({text: 'Enter your password', type: 'danger'});
    } else {
      setLoading(!isLoading);
      // loginUser(getLoginModel(userName, password))
      RNFetchBlob.fetch(
        'POST',
        constants.API.SERVER_URL + constants.API.LOGIN_USER,
        {
          Authorization: '',
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          email: userName,
          password: password,
        }),
      )
        .then(res => {
          setLoading(isLoading);
          let data = JSON.parse(res.data);
          if (data.error !== null) {
            showToast({text: data.error, type: 'danger'});
          } else {
            setLoading(isLoading);
            console.log('TOKEN : ', data.token);
            setUserName('');
            setPassword('');
            console.log('LOGIN RESPONSE => ' + JSON.stringify(res));
            storeLocalData(constants.ACCESS_TOKEN, data.token);
            storeLocalData(constants.USER_ID, data.userId);
            storeLocalData(constants.USER_NAME, data.name);
            navigation.navigate(NAV_TYPES.HOME_SCREEN, {});
          }
        })
        .catch((errorMessage, statusCode) => {
          setLoading(isLoading);
          console.log('LOGIN ERROR ', errorMessage);
        });
    }
  };
  const onSignUpClick = () => {
    navigation.navigate(NAV_TYPES.REGISTER, {});
  };

  return (
    <SafeAreaView style={container}>
      {isLoading && <LoadingComponent />}
      {/* {!isLoading && ( */}
      <Root style={[container, {flexDirection: 'column'}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <View style={styles.headerView}>
            <Icon
              type="FontAwesome5"
              name="user-graduate"
              style={styles.logoStyle}
            />
            <_Text style={styles.logoTextStyle}>{constants.APP_NAME}</_Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={styles.contentView}>
              <View style={{flexDirection: 'column'}}>
                <_Text description style={[poppinsRegular, styles.labelStyle]}>
                  Email
                </_Text>
                <_TextInput
                  value={userName}
                  inputStyle={[poppinsMedium, styles.inputStyle]}
                  floatingLabel={false}
                  keyboardType={'default'}
                  containerStyle={{width: '100%', marginLeft: 0}}
                  onChangeText={data => {
                    setUserName(data.value);
                  }}
                />

                <_Text description style={[poppinsRegular, styles.labelStyle]}>
                  Password
                </_Text>
                <_TextInput
                  value={password}
                  inputStyle={[poppinsMedium, styles.inputStyle]}
                  floatingLabel={false}
                  keyboardType={'numeric'}
                  secureTextEntry={true}
                  containerStyle={{width: '100%', marginLeft: 0}}
                  onChangeText={data => {
                    setPassword(data.value);
                  }}
                />
              </View>

              <View style={styles.buttonLoginView}>
                <Button onPress={() => onLoginClick()} style={styles.login}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Login</Text>
                </Button>
                <BorderlessButton
                  onPress={() => onSignUpClick()}
                  style={styles.buttonSignupView}>
                  <Text style={styles.signup}>SIGN UP</Text>
                </BorderlessButton>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Root>
      {/* )} */}
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: GREEN,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  logoStyle: {
    fontSize: 50,
    color: WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoTextStyle: {
    marginTop: '2%',
    color: WHITE,
    fontSize: 26,
  },
  contentView: {
    margin: '3%',
    flex: 1,
    flexDirection: 'column',
    height: '55%',
    paddingTop: 20,
  },
  inputStyle: {
    justifyContent: 'center',
    paddingBottom: '-1%',
    color: TEXT_SUBTITLE,
    marginTop: -10,
  },
  labelStyle: {
    marginTop: '8%',
    fontSize: 16,
    color: GRAY,
  },
  buttonLoginView: {
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonSignupView: {
    marginTop: 10,
    width: '100%',
    height: 60,
    backgroundColor: WHITE,
    justifyContent: 'center',
  },
  login: {
    width: '100%',
    height: 60,
    backgroundColor: MID_GREEN,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  signup: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: WHITE,
    alignSelf: 'center',
    color: MID_GREEN,
  },
});
