import {RadioOption} from '../Components/RadioButton/RadioButton';
import {
  AgeGroup,
  FeeType,
  VaccineType,
} from '../Components/SettingsScreen/SettingsScreen';

export const DISTRICT_ID_PREF = '395';

export const minAge = AgeGroup.minAge(AgeGroup.AgeAbove18);

export const AgeFilters: RadioOption[] = [
  {
    key: AgeGroup.minAge(AgeGroup.AgeAbove18).toString(),
    text: AgeGroup.displayValue(AgeGroup.AgeAbove18),
  },
  {
    key: AgeGroup.minAge(AgeGroup.AgeAbove45).toString(),
    text: AgeGroup.displayValue(AgeGroup.AgeAbove45),
  },
];

export const VACCINE_PREF = VaccineType[VaccineType.BOTH];

export const AvailableVaccineTypes: RadioOption[] = [
  {
    key: VaccineType[VaccineType.COVISHIELD],
    text: VaccineType[VaccineType.COVISHIELD],
  },
  {
    key: VaccineType[VaccineType.COVAXIN],
    text: VaccineType[VaccineType.COVAXIN],
  },
  {
    key: VaccineType[VaccineType.BOTH],
    text: VaccineType[VaccineType.BOTH],
  },
];

export const DOSE_PREF = 1;

export const DoseChoices: RadioOption[] = [
  {
    key: '1',
    text: '1',
  },
  {
    key: '2',
    text: '2',
  },
];

export const FEE_PREF = FeeType[FeeType.BOTH];

export const FeeTypeChoices: RadioOption[] = [
  {
    key: FeeType[FeeType.FREE],
    text: FeeType[FeeType.FREE],
  },
  {
    key: FeeType[FeeType.PAID],
    text: FeeType[FeeType.PAID],
  },
  {
    key: FeeType[FeeType.BOTH],
    text: FeeType[FeeType.BOTH],
  },
];

export type STATE = {
  state_id: number;
  state_name: string;
};

export type DISTRICT = {
  district_id: number;
  district_name: string;
};

export const STATES: STATE[] = [
  {state_id: 1, state_name: 'Andaman and Nicobar Islands'},
  {state_id: 2, state_name: 'Andhra Pradesh'},
  {state_id: 3, state_name: 'Arunachal Pradesh'},
  {state_id: 4, state_name: 'Assam'},
  {state_id: 5, state_name: 'Bihar'},
  {state_id: 6, state_name: 'Chandigarh'},
  {state_id: 7, state_name: 'Chhattisgarh'},
  {state_id: 8, state_name: 'Dadra and Nagar Haveli'},
  {state_id: 37, state_name: 'Daman and Diu'},
  {state_id: 9, state_name: 'Delhi'},
  {state_id: 10, state_name: 'Goa'},
  {state_id: 11, state_name: 'Gujarat'},
  {state_id: 12, state_name: 'Haryana'},
  {state_id: 13, state_name: 'Himachal Pradesh'},
  {state_id: 14, state_name: 'Jammu and Kashmir'},
  {state_id: 15, state_name: 'Jharkhand'},
  {state_id: 16, state_name: 'Karnataka'},
  {state_id: 17, state_name: 'Kerala'},
  {state_id: 18, state_name: 'Ladakh'},
  {state_id: 19, state_name: 'Lakshadweep'},
  {state_id: 20, state_name: 'Madhya Pradesh'},
  {state_id: 21, state_name: 'Maharashtra'},
  {state_id: 22, state_name: 'Manipur'},
  {state_id: 23, state_name: 'Meghalaya'},
  {state_id: 24, state_name: 'Mizoram'},
  {state_id: 25, state_name: 'Nagaland'},
  {state_id: 26, state_name: 'Odisha'},
  {state_id: 27, state_name: 'Puducherry'},
  {state_id: 28, state_name: 'Punjab'},
  {state_id: 29, state_name: 'Rajasthan'},
  {state_id: 30, state_name: 'Sikkim'},
  {state_id: 31, state_name: 'Tamil Nadu'},
  {state_id: 32, state_name: 'Telangana'},
  {state_id: 33, state_name: 'Tripura'},
  {state_id: 34, state_name: 'Uttar Pradesh'},
  {state_id: 35, state_name: 'Uttarakhand'},
  {state_id: 36, state_name: 'West Bengal'},
];
