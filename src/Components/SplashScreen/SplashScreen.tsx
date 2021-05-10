import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './../../Navigation/RootStackParams';
import {name as appName} from './../../app.json';
import {
  checkFirstLaunch,
  checkUserStatus,
  removeCredentials,
} from '../../Storage/LocalStorage';

type splashScreenProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

const SplashScreen = () => {
  const navigation = useNavigation<splashScreenProp>();

  useEffect(() => {
    checkFirstLaunch().then(isFirstTime => {
      if (isFirstTime) {
        removeCredentials();
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          });
        }, 1000);
      } else {
        checkUserStatus().then(data => {
          if (data) {
            console.log(`Existing Token: ${data}`);
            navigation.reset({
              index: 0,
              routes: [{name: 'SlotListScreen', params: {token: data}}],
            });
          } else {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen'}],
              });
            }, 1000);
          }
        });
      }
    });
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{appName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default SplashScreen;
