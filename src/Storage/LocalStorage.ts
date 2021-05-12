import Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Beneficiary} from '../Types/BeneficiaryTypes';

const setLoggedInTime = async (date: string) => {
  await AsyncStorage.setItem('LoginTimestamp', date);
};

const getLoggedInTime = async (): Promise<number | undefined> => {
  try {
    const time = await AsyncStorage.getItem('LoginTimestamp');
    if (time) {
      return +time;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
  return undefined;
};

export const setCredentials = async (mobile: string, token: string) => {
  try {
    const cred = await Keychain.setGenericPassword(mobile, token);
    if (cred) {
      setLoggedInTime(Date.now().toString());
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

export const checkUserStatus = async (): Promise<string | undefined> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    const loginTimestamp = await getLoggedInTime();
    console.log('Now: ' + Date.now() + ' Past: ' + loginTimestamp);
    if (
      credentials &&
      loginTimestamp &&
      Date.now() - loginTimestamp <= 15 * 60 * 1000
    ) {
      return credentials.password;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
    return undefined;
  }
};

export const removeCredentials = async () => {
  await Keychain.resetGenericPassword();
};

export const checkFirstLaunch = async (): Promise<boolean> => {
  const isNotFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
  if (isNotFirstLaunch) {
    return false;
  } else {
    AsyncStorage.setItem('isFirstLaunch', 'YES');
    return true;
  }
};

export const saveBeneficiaryList = async (
  beneficiaryNames: Array<Beneficiary>,
) => {
  AsyncStorage.setItem('beneficiaryList', JSON.stringify(beneficiaryNames));
};

export const getBeneficiaryList = async (): Promise<
  Array<Beneficiary> | undefined
> => {
  const storedBeneficiaryListString = await AsyncStorage.getItem(
    'beneficiaryList',
  );
  if (storedBeneficiaryListString) {
    const res = JSON.parse(storedBeneficiaryListString) as Array<Beneficiary>;
    if (res) {
      return res;
    } else {
      console.log('Cant parse it back to Beneficiary');
    }
  }
  return undefined;
};

export const saveUserAgePreference = async (age: number) => {
  AsyncStorage.setItem('UserAgePreference', age.toString());
};

export const getUserAgePreference = async (): Promise<number | undefined> => {
  const agePref = await AsyncStorage.getItem('UserAgePreference');
  if (agePref) {
    return +agePref;
  }
  return undefined;
};

export const saveUserDosePreference = async (dose: number) => {
  AsyncStorage.setItem('UserDosePreference', dose.toString());
};

export const getUserDosePreference = async (): Promise<number | undefined> => {
  const dosePref = await AsyncStorage.getItem('UserDosePreference');
  if (dosePref) {
    return +dosePref;
  }
  return undefined;
};

export const saveUserVaccinePreference = async (vaccine: string) => {
  AsyncStorage.setItem('UserVaccinePreference', vaccine);
};

export const getUserVaccinePreference = async (): Promise<
  string | undefined
> => {
  const vaccinePref = await AsyncStorage.getItem('UserVaccinePreference');
  if (vaccinePref) {
    return vaccinePref;
  }
  return undefined;
};

export const saveUserFeeTypePreference = async (fee: string) => {
  AsyncStorage.setItem('UserFeeTypePreference', fee);
};

export const getUserFeeTypePreference = async (): Promise<
  string | undefined
> => {
  const feePref = await AsyncStorage.getItem('UserFeeTypePreference');
  if (feePref) {
    return feePref;
  }
  return undefined;
};

export const saveUserStateIdPreference = async (stateId: number) => {
  AsyncStorage.setItem('UserStateIdPreference', stateId.toString());
};

export const getUserStateIdPreference = async (): Promise<
  number | undefined
> => {
  const statePref = await AsyncStorage.getItem('UserStateIdPreference');
  if (statePref) {
    return +statePref;
  }
  return undefined;
};

export const saveUserStatePreference = async (state: string) => {
  AsyncStorage.setItem('UserStatePreference', state);
};

export const getUserStatePreference = async (): Promise<string | undefined> => {
  const statePref = await AsyncStorage.getItem('UserStatePreference');
  if (statePref) {
    return statePref;
  }
  return undefined;
};

export const saveUserDistrictIdPreference = async (districtId: number) => {
  AsyncStorage.setItem('UserDistrictIdPreference', districtId.toString());
};

export const getUserDistrictIdPreference = async (): Promise<
  string | undefined
> => {
  const districtPref = await AsyncStorage.getItem('UserDistrictIdPreference');
  if (districtPref) {
    return districtPref;
  }
  return undefined;
};

export const saveUserDistrictPreference = async (fee: string) => {
  AsyncStorage.setItem('UserDistrictePreference', fee);
};

export const getUserDistrictPreference = async (): Promise<
  string | undefined
> => {
  const districtPref = await AsyncStorage.getItem('UserDistrictPreference');
  if (districtPref) {
    return districtPref;
  }
  return undefined;
};
