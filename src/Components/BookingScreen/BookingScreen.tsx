import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TextInput, View, StyleSheet, Button, Alert} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {bookAppointment} from '../../API/APIHelper';
import {getCaptcha} from '../../API/APIHelper';
import {DOSE_PREF} from '../../Constants/Constants';
import {RootStackParamList} from '../../Navigation/RootStackParams';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'BookingScreen'>;

export const BookingScreen = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const token = route.params.token;
  const session = route.params.session;
  const selectedBens = route.params.selectedBens;

  const [nCaptcha, setCaptcha] = useState('');
  const [captchText, setCaptchText] = useState('');

  useEffect(() => {
    getCaptchConsumer();
  }, []);

  const getCaptchConsumer = () => {
    getCaptcha(token).then(captcha => {
      if (captcha) {
        console.log(captcha);

        setCaptcha(captcha);
      }
    });
  };

  const onRegenerateCaptcha = () => {
    getCaptchConsumer();
  };

  const onSubmitPressed = () => {
    if (captchText.length == 0) {
      return;
    }
    bookAppointment(
      token,
      DOSE_PREF,
      session.session_id,
      session.slots[0],
      selectedBens.map(i => i.beneficiary_reference_id),
      captchText,
    ).then(appointmentId => {
      if (appointmentId) {
        Alert.alert(
          'Congratulations!',
          'Your slot is booked with Appointment ID: ' + appointmentId,
        );
      } else {
        Alert.alert('Oops!', 'Sorry, we could not book that slot!');
      }
    });
  };

  return (
    <View>
      {nCaptcha.length > 0 ? (
        <SvgUri width="150" height="50" svgXmlData={nCaptcha} />
      ) : null}
      <TextInput
        placeholder="Type Captch Text Here"
        placeholderTextColor="#c4c3cb"
        style={styles.captchaTextInput}
        onChangeText={setCaptchText}
        value={captchText}
      />
      <Button onPress={onSubmitPressed} title="Submit Captcha and Book" />
      <Button onPress={onRegenerateCaptcha} title="Refresh Captcha" />
    </View>
  );
};

const styles = StyleSheet.create({
  captchaTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
});
