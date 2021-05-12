import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from './../../Navigation/RootStackParams';
import {name as appName} from './../../app.json';
import {getOTPFromAPI} from '../../API/APIHelper';

type authScreenProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const LoginScreen = () => {
  const navigation = useNavigation<authScreenProp>();

  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getOTPConsumer = (mobileNumber: string) => {
    if (mobileNumber.length < 10) {
      setErrorMessage('Enter Valid Mobile Number');
      return;
    }
    setErrorMessage('');
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

  const onGetOTPPress = () => {
    console.log(mobileNumber);
    getOTPConsumer(mobileNumber);
  };

  const onSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'SlotListScreen', params: {token: ''}}],
    });
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <ScrollView
        scrollEnabled={true}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>{appName}</Text>
              <TextInput
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                placeholder="Mobile"
                placeholderTextColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={setMobileNumber}
                value={mobileNumber}
              />
              {errorMessage.length > 0 ? (
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: '#ff0000'}}>{errorMessage}</Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 16,
                }}>
                <Button onPress={onGetOTPPress} title="Get OTP" />
              </View>
              <View style={{alignItems: 'center', marginTop: 16}}>
                <Button onPress={onSkip} title="SKIP Login" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    width: 100,
    marginTop: 10,
  },
});
