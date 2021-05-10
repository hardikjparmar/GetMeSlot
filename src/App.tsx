/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {createContext, useContext, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from './Navigation/RootStackParams';
import OTPScreen from './Components/OTPScreen/OTPScreen';
import SlotListScreen from './Components/SlotListScreen/SlotListScreen';
import SplashScreen from './Components/SplashScreen/SplashScreen';
import LoginScreen from './Components/LoginScreen/Login';

import {name as appName} from './app.json';

import Navigator from './Navigation/RootNavigation';
import BeneficiaryListScreen from './Components/BeneficiaryListScreen/BeneficiaryListScreen';

import {
  districtId,
  FEE_PREF,
  minAge,
  VACCINE_PREF,
} from './Constants/Constants';
import {today} from './DateHelper/DateHelper';
import {getSlots} from './API/APIHelper';
import PushNotification from 'react-native-push-notification';
import {AppRegistry, Platform, PushNotificationIOS} from 'react-native';
import {Center} from './Types/SlotTypes';
import {
  FeeType,
  SettingsScreen,
  VaccineType,
} from './Components/SettingsScreen/SettingsScreen';
import {
  getUserAgePreference,
  getUserFeeTypePreference,
  getUserVaccinePreference,
} from './Storage/LocalStorage';
import {BookingScreen} from './Components/BookingScreen/BookingScreen';

const CHANNEL_ID = 'SLOT_AVAILABLE';

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: CHANNEL_ID, // (required)
    channelName: 'GetMeSlot Slot Available', // (required)
    channelDescription: 'Slot Available', // (optional) default: undefined.
    playSound: true,
    soundName: 'default',
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

const Stack = createStackNavigator<RootStackParamList>();

type SlotContextType = {
  centers: Center[];
  setCenters: (centers: Center[]) => void;
};

const SlotContext = createContext<SlotContextType>({
  centers: [],
  setCenters: (centers: Center[]) => console.warn('No setter'),
});

export const useSlots = () => useContext(SlotContext);

const App = () => {
  const [centers, setCenters] = useState<Array<Center>>([]);

  const alert = () => {
    PushNotification.localNotification({
      channelId: CHANNEL_ID,
      message: 'Slots available! Hurry up!',
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 1000,
      showWhen: true,
      when: Date.now(),
    });
  };

  const MyHeadlessTask = async () => {
    console.log('Receiving GetMeSlot in Index!');
    const agePromise = getUserAgePreference();
    const vaccinePromise = getUserVaccinePreference();
    const feePromise = getUserFeeTypePreference();

    const allPromise = Promise.all([agePromise, vaccinePromise, feePromise]);

    allPromise.then(([age, vaccine, fee]) => {
      let preferredAge = minAge;
      if (age) {
        preferredAge = age;
      }
      console.log('Preferred Age: ' + preferredAge);
      let preferredVaccine = VACCINE_PREF;
      if (vaccine) {
        preferredVaccine = vaccine;
      }
      console.log('Preferred Vaccine: ' + preferredVaccine);
      let preferredFees = FEE_PREF;
      if (fee) {
        preferredFees = fee;
      }
      console.log('Preferred Fee: ' + preferredFees);
      const vaccineParam =
        preferredVaccine !== VaccineType[VaccineType.BOTH]
          ? preferredVaccine
          : undefined;
      getSlots(districtId, today(), '', vaccineParam).then(res => {
        if (res) {
          setCenters(res);
          const filteredList = res.filter(item => {
            return (
              item.sessions.filter(
                session =>
                  session.available_capacity > 0 &&
                  session.min_age_limit === preferredAge,
              ).length > 0 &&
              (preferredFees !== FeeType[FeeType.BOTH]
                ? item.fee_type.toLowerCase() === preferredFees.toLowerCase()
                : true)
            );
          });
          if (filteredList.length > 0) {
            alert();
          }
        }
      });
    });
  };

  useEffect(() => {
    AppRegistry.registerHeadlessTask('GetMeSlotService', () => MyHeadlessTask);
  }, []);

  return (
    <SlotContext.Provider value={{centers, setCenters}}>
      <NavigationContainer ref={Navigator.setContainer}>
        <Stack.Navigator>
          {/* SplashScreen which will come once for 5 Seconds */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            // Hiding header for Splash Screen
            options={{headerShown: false}}
          />
          {/* Auth Navigator: Include Login and Signup */}
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OTPScreen"
            component={OTPScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SlotListScreen"
            component={SlotListScreen}
            options={{headerShown: true, title: appName}}
          />
          <Stack.Screen
            name="BeneficiaryListScreen"
            component={BeneficiaryListScreen}
            options={{headerShown: true, title: 'Beneficiary List'}}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{headerShown: true, title: 'Settings'}}
          />
          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{headerShown: true, title: 'Booking Slot'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SlotContext.Provider>
  );
};

export default App;
