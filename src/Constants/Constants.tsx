import {RadioOption} from '../Components/RadioButton/RadioButton';
import {
  AgeGroup,
  FeeType,
  VaccineType,
} from '../Components/SettingsScreen/SettingsScreen';

export const districtId = '395';

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
