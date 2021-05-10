import {Beneficiary} from '../Types/BeneficiaryTypes';
import {Session} from '../Types/SlotTypes';

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  OTPScreen: {txnId: string; mobileNumber: string};
  SlotListScreen: {token: string};
  BeneficiaryListScreen: {
    token: string;
    onBeneficiarySelected?: (beneficiary: Array<Beneficiary>) => void;
  };
  SettingsScreen: {beneficiaries: Beneficiary[]};
  BookingScreen: {token: string; session: Session; selectedBens: Beneficiary[]};
};
