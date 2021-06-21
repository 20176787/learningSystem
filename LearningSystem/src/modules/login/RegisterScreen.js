import React, {Component, useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {DEFAULT_STYLES} from '../../utils/styles';
import {
  GREEN,
  WHITE,
  TEXT_SUBTITLE,
  GRAY,
  LIGHT_GREEN,
  MID_GREEN,
} from '../../utils/colors';
import {Icon, Button, Root, Text} from 'native-base';
import _Text from '../../components/_Text';
import _TextInput from '../../components/_TextInput';
import CountryPicker, {FlagButton} from 'react-native-country-picker-modal';
import OTPValidation from './OTPValidation';
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
const {width, height} = Dimensions.get('window');
const RegisterScreen = ({navigation}) => {
  const [countryCode, setCountryCode] = useState('');
  const [country, setCountry] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [mobile, setMobile] = useState('');
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

  const onSelect = country => {
    console.log(country);
    setCountryCode(country.cca2);
    setCountry(country);
  };

  const onSignUpClick = () => {
    if (userName === '') {
      showToast({text: 'Select your userName', type: 'danger'});
    } else if (email === '') {
      showToast({text: 'Enter your email', type: 'danger'});
    } else if (password === '') {
      showToast({text: 'Enter your password', type: 'danger'});
    } else if (rePassword === '') {
      showToast({text: 'Enter your rePassword', type: 'danger'});
    } else {
      setLoading(!isLoading);
      RNFetchBlob.fetch(
        'POST',
        constants.API.SERVER_URL + constants.API.REGISTER_USER,
        {
          Authorization: '',
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          name: userName,
          email: email,
          password: password,
          rePassword: rePassword,
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
            setEmail('');
            setRePassword('');
            console.log('LOGIN RESPONSE => ' + JSON.stringify(res));
            storeLocalData(constants.ACCESS_TOKEN, data.token);
            storeLocalData(constants.USER_ID, data.userId);
            storeLocalData(constants.USER_NAME, userName);
            navigation.navigate(NAV_TYPES.HOME_SCREEN, {});
          }
        })
        .catch((errorMessage, statusCode) => {
          setLoading(isLoading);
          console.log('LOGIN ERROR ', errorMessage);
        });
    }
  };

  const onLoginClick = () => {
    navigation && navigation.goBack();
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
              <View style={{flexDirection: 'column', marginTop: '-4%'}}>
                <_Text description style={[poppinsRegular, styles.labelStyle]}>
                  Enter Name
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
                  Enter Email
                </_Text>

                <_TextInput
                  value={email}
                  inputStyle={[poppinsMedium, styles.inputStyle]}
                  floatingLabel={false}
                  keyboardType={'default'}
                  containerStyle={{width: '100%', marginLeft: 0}}
                  onChangeText={data => {
                    setEmail(data.value);
                  }}
                />
                <_Text description style={[poppinsRegular, styles.labelStyle]}>
                  Enter Password
                </_Text>

                <_TextInput
                  value={password}
                  inputStyle={[poppinsMedium, styles.inputStyle]}
                  floatingLabel={false}
                  keyboardType={'numeric'}
                  containerStyle={{width: '100%', marginLeft: 0}}
                  secureTextEntry={true}
                  onChangeText={data => {
                    setPassword(data.value);
                  }}
                />
                <_Text description style={[poppinsRegular, styles.labelStyle]}>
                  Enter RePassword
                </_Text>
                <_TextInput
                  value={rePassword}
                  secureTextEntry={true}
                  inputStyle={[poppinsMedium, styles.inputStyle]}
                  floatingLabel={false}
                  keyboardType={'numeric'}
                  containerStyle={{width: '100%', marginLeft: 0}}
                  onChangeText={data => {
                    setRePassword(data.value);
                  }}
                />
              </View>

              <View style={styles.buttonLoginView}>
                <Button onPress={() => onSignUpClick()} style={styles.login}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Sign Up
                  </Text>
                </Button>
                <BorderlessButton
                  onPress={() => onLoginClick()}
                  style={styles.buttonSignupView}>
                  <Text style={styles.signup}>LOGIN</Text>
                </BorderlessButton>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Root>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
