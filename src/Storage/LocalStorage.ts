import Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Beneficiary} from '../Types/BeneficiaryTypes';

export const setCredentials = async (mobile: string, token: string) => {
  await Keychain.setGenericPassword(mobile, token);
};

export const checkUserStatus = async (): Promise<string | undefined> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
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
