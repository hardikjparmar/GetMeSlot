import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from './../../Navigation/RootStackParams';
import {name as appName} from './../../app.json';
import {getOTPFromAPI, loginAPI} from '../../API/APIHelper';
import {removeCredentials, setCredentials} from '../../Storage/LocalStorage';

type otpScreenProp = StackNavigationProp<RootStackParamList, 'OTPScreen'>;
type otpScreenRouteProp = RouteProp<RootStackParamList, 'OTPScreen'>;

const OTPScreen = () => {
  const navigation = useNavigation<otpScreenProp>();
  const route = useRoute<otpScreenRouteProp>();

  const txnId = route.params.txnId;
  const mobileNumber = route.params.mobileNumber;
  const [otp, setOtp] = useState('');
  const [shouldShowResendOption, setShouldShowResendOption] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let t: NodeJS.Timeout | undefined;
    if (!shouldShowResendOption) {
      const goOn = () => {
        t = setTimeout(() => {
          setTimer(timer - 1);
          if (timer > 1) {
            goOn();
          } else {
            setShouldShowResendOption(true);
            setTimer(30);
          }
        }, 1000);
      };
      goOn();
    }
    return function cleanup() {
      if (t) {
        clearTimeout(t);
      }
    };
  });

  const onLoginPress = async () => {
    console.log(txnId);
    loginAPIConsumer(otp, txnId);
  };

  const loginAPIConsumer = (otp: string, txnId: string) => {
    loginAPI(otp, txnId)
      .then(token => {
        if (token) {
          removeCredentials().then(() => {
            setCredentials(mobileNumber, token).then(() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'SlotListScreen', params: {token: token}}],
              }),
            );
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getOTPConsumer = (mobileNumber: string) => {
    console.log(`MobileNumber: ${mobileNumber}`);
    setShouldShowResendOption(false);
    getOTPFromAPI(mobileNumber).then(response => {
      console.log(response);
      if (response) {
        navigation.navigate('OTPScreen', {
          txnId: response,
          mobileNumber: mobileNumber,
        });
      }
    });
  };

  const onSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'SlotListScreen', params: {token: ''}}],
    });
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>{appName}</Text>
            <TextInput
              keyboardType="phone-pad"
              placeholder="OTP"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={setOtp}
              value={otp}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
              }}>
              <Button onPress={onLoginPress} title="Login" />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
              }}>
              {shouldShowResendOption ? (
                <Button
                  onPress={() => getOTPConsumer(mobileNumber)}
                  title="Resend OTP"
                />
              ) : (
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  You can resend OTP in {timer}s
                </Text>
              )}
            </View>
            <View style={{alignItems: 'center', marginTop: 16}}>
              <Button onPress={onSkip} title="SKIP Login" />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    color: '#000000',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
});
