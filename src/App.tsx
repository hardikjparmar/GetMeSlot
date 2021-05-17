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
  DISTRICT_ID_PREF,
  FEE_PREF,
  minAge,
  VACCINE_PREF,
} from './Constants/Constants';
import {today} from './DateHelper/DateHelper';
import {getSlots} from './API/APIHelper';
import PushNotification from 'react-native-push-notification';
import {AppRegistry, Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Center} from './Types/SlotTypes';
import {
  FeeType,
  SettingsScreen,
  VaccineType,
} from './Components/SettingsScreen/SettingsScreen';
import {
  checkUserStatus,
  getLastAuthAlertTime,
  getMobileNumber,
  getUserAgePreference,
  getUserDistrictIdPreference,
  getUserFeeTypePreference,
  getUserLoginPreference,
  getUserVaccinePreference,
  setLastAuthAlertTime,
} from './Storage/LocalStorage';
import {BookingScreen} from './Components/BookingScreen/BookingScreen';

const SLOT_CHANNEL_ID = 'NEW_SLOT_AVAILABLE';
const AUTH_CHANNEL_ID = 'AUTH_EXPIRED';

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification
    if (
      notification.action == 'Enter OTP' &&
      notification.userInteraction &&
      !notification.foreground
    ) {
      console.log('Enter OTP clicked!');
      getMobileNumber().then(mobile => {
        console.log('Saved Mobile Number: ', mobile);
        if (mobile) {
          Navigator.reAuth(mobile);
        } else {
          Navigator.reset();
        }
      });
    }
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log('Action: ', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: SLOT_CHANNEL_ID, // (required)
    channelName: 'Slot Available', // (required)
    channelDescription: 'Slot Available', // (optional) default: undefined.
    playSound: true,
    soundName: 'notification_tone.mp3',
    vibrate: true,
    importance: 5,
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.createChannel(
  {
    channelId: AUTH_CHANNEL_ID, // (required)
    channelName: 'Session Expired', // (required)
    channelDescription: 'Login Session Expired, Authorise again!', // (optional) default: undefined.
    playSound: true,
    soundName: 'notification_tone.mp3',
    vibrate: true,
    importance: 5,
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

const Stack = createStackNavigator<RootStackParamList>();

type SlotContextType = {
  centers: Center[];
  setCenters: (centers: Center[]) => void;
  ageFilter: string;
  setAgeFilter: (age: string) => void;
  selectedVaccine: VaccineType;
  setSelectedVaccine: (vaccine: VaccineType) => void;
  selectedFeeType: FeeType;
  setSelectedFeeType: (fee: FeeType) => void;
  selectedState: number;
  setSelectedState: (state: number) => void;
  selectedDistrict: number;
  setSelectedDistrict: (district: number) => void;
  selectedDose: number;
  setSelectedDose: (dose: number) => void;
  shouldAutoLogin: boolean;
  setShouldAutoLogin: (autologin: boolean) => void;
};

const SlotContext = createContext<SlotContextType>({
  centers: [],
  setCenters: (centers: Center[]) => console.warn('No setter'),
  ageFilter: '',
  setAgeFilter: (age: string) => console.warn('No setter'),
  selectedVaccine: VaccineType.COVISHIELD,
  setSelectedVaccine: (vaccine: VaccineType) => console.warn('No setter'),
  selectedFeeType: FeeType.BOTH,
  setSelectedFeeType: (fee: FeeType) => console.warn('No setter'),
  selectedState: 0,
  setSelectedState: (state: number) => console.warn('No setter'),
  selectedDistrict: 0,
  setSelectedDistrict: (district: number) => console.warn('No setter'),
  selectedDose: 1,
  setSelectedDose: (dose: number) => console.warn('No setter'),
  shouldAutoLogin: false,
  setShouldAutoLogin: (autologin: boolean) => console.warn('No setter'),
});

export const useSlots = () => useContext(SlotContext);

const App = () => {
  const [centers, setCenters] = useState<Array<Center>>([]);
  const [ageFilter, setAgeFilter] = useState(minAge.toString());
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineType>(
    VaccineType.COVISHIELD,
  );
  const [selectedFeeType, setSelectedFeeType] = useState(FeeType.BOTH);
  const [selectedState, setSelectedState] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  const [selectedDose, setSelectedDose] = useState(1);
  const [shouldAutoLogin, setShouldAutoLogin] = useState(false);

  const alert = () => {
    PushNotification.localNotification({
      channelId: SLOT_CHANNEL_ID,
      message: 'Slots available! Hurry up!',
      playSound: true,
      soundName: 'notification_tone.mp3',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 1000,
      showWhen: true,
      when: Date.now(),
      smallIcon: 'ic_stat_getmeslot',
      largeIcon: '',
      id: 321,
      messageId: '321',
    });
  };

  const getOTPNotification = () => {
    PushNotification.localNotification({
      channelId: AUTH_CHANNEL_ID,
      message: 'Enter OTP to continue getting latest updates for slots',
      playSound: true,
      soundName: 'notification_tone.mp3',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 1000,
      showWhen: true,
      when: Date.now(),
      smallIcon: 'ic_stat_getmeslot',
      largeIcon: '',
      actions: ['Enter OTP'],
      id: 123,
      messageId: '123',
    });
  };

  const MyHeadlessTask = async () => {
    console.log('Receiving GetMeSlot in Index!');
    const agePromise = getUserAgePreference();
    const vaccinePromise = getUserVaccinePreference();
    const feePromise = getUserFeeTypePreference();
    const districtIdPromise = getUserDistrictIdPreference();
    const tokenPromise = checkUserStatus();
    const loginPromise = getUserLoginPreference();

    const allPromise = Promise.all([
      agePromise,
      vaccinePromise,
      feePromise,
      districtIdPromise,
      tokenPromise,
      loginPromise,
    ]);

    allPromise.then(([age, vaccine, fee, disId, token, autoLogin]) => {
      let preferredAge = age ? age : minAge;
      setAgeFilter(preferredAge.toString());
      console.log('Preferred Age: ' + preferredAge);
      let preferredVaccine = vaccine ? vaccine : VACCINE_PREF;
      setSelectedVaccine(
        VaccineType[preferredVaccine as keyof typeof VaccineType],
      );
      console.log('Preferred Vaccine: ' + preferredVaccine);
      let preferredFees = fee ? fee : FEE_PREF;
      setSelectedFeeType(FeeType[preferredFees as keyof typeof FeeType]);
      console.log('Preferred Fee: ' + preferredFees);
      let preferredDistrictId = disId ? disId : DISTRICT_ID_PREF;
      setSelectedDistrict(+preferredDistrictId);
      console.log('Preferred District: ' + preferredDistrictId);
      let currentToken = token ? token : '';
      const vaccineParam =
        preferredVaccine !== VaccineType[VaccineType.BOTH]
          ? preferredVaccine
          : undefined;
      if (autoLogin) {
        setShouldAutoLogin(autoLogin);
      }
      if (token === undefined && autoLogin === true) {
        console.log('token expired!!!');
        getLastAuthAlertTime().then(time => {
          if (
            (time && Date.now() - time > 5 * 60 * 1000) ||
            time === undefined
          ) {
            // 5 mins
            getOTPNotification();
            setLastAuthAlertTime(Date.now().toString());
          }
        });
      }
      getSlots(preferredDistrictId, today(), currentToken, vaccineParam).then(
        res => {
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
        },
      );
    });
  };

  useEffect(() => {
    AppRegistry.registerHeadlessTask('GetMeSlotService', () => MyHeadlessTask);
  }, []);

  return (
    <SlotContext.Provider
      value={{
        centers,
        setCenters,
        ageFilter,
        setAgeFilter,
        selectedVaccine,
        setSelectedVaccine,
        selectedFeeType,
        setSelectedFeeType,
        selectedState,
        setSelectedState,
        selectedDistrict,
        setSelectedDistrict,
        selectedDose,
        setSelectedDose,
        shouldAutoLogin,
        setShouldAutoLogin,
      }}>
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
            options={{headerShown: true, title: 'Filters & Settings'}}
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
