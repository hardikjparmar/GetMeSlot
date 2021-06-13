import axios from 'axios';
import {sha256} from 'react-native-sha256';
import {
  baseUrl,
  confirmOTP,
  generateOTP,
  getSlots as getSlotUrl,
  getSlotsProtected as getSlotsProtectedUrl,
  getBeneficieryDetails as getBeneficieryDetailsUrl,
  bookAppointment as bookAppointmentUrl,
  getCaptcha as getCaptchaUrl,
  cancelAppointment,
  getDistricts as getDistrictsUrl,
} from './APIEndpoints';
import {removeCredentials} from '../Storage/LocalStorage';
import {Center} from '../Types/SlotTypes';
import Navigator from '../Navigation/RootNavigation';
import {Beneficiary} from '../Types/BeneficiaryTypes';
import {DISTRICT} from '../Constants/Constants';

let api = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
    origin: 'https://selfregistration.cowin.gov.in/',
    referer: 'https://selfregistration.cowin.gov.in/',
  },
});

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status === 401) {
      console.log('Authentication Error');
      removeCredentials();
      Navigator.reset();
    }
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      console.log('Authentication Error');
      removeCredentials();
      Navigator.reset();
    }
    return Promise.reject(error);
  },
);

export const getOTPFromAPI = async (
  mobileNumber: string,
): Promise<string | undefined> => {
  try {
    const response = await api({
      url: generateOTP,
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        mobile: mobileNumber,
        secret:
          'U2FsdGVkX1892T80/cPKnwKOzrcRWBDv1dk9enPOEwY7pEGpoY6OojeFSOjpQqGYOpxL40i2Q/1O2yeR4xQErQ==',
      },
    });

    if (response) {
      console.log(`TXN ID: ${response.data.txnId}`);
      return response.data.txnId;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
};

export const loginAPI = async (
  otp: string,
  txnId: string,
): Promise<string | undefined> => {
  try {
    const hash = await sha256(otp);
    if (hash) {
      const response = await api({
        url: confirmOTP,
        method: 'post',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          otp: hash,
          txnId: txnId,
        },
      });
      if (response) {
        console.log(`LOGIN Response:`);
        console.log(response);

        console.log(`LOGIN TOKEN: ${response.data.token}`);
        return response.data.token;
      }
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
};
const start = Date.now();
let count = 0;
export const getSlots = async (
  districtId: string,
  date: string,
  token: string,
  vaccine?: string,
): Promise<Array<Center> | undefined> => {
  let params: any;
  if (vaccine) {
    params = {
      district_id: districtId,
      date: date,
      vaccine: vaccine,
    };
  } else {
    params = {
      district_id: districtId,
      date: date,
    };
  }
  count += 1;
  console.log('DistrictId: ' + districtId);
  console.log('date: ' + date);
  console.log('token: ' + token);
  console.log('vaccine: ' + vaccine);

  let headers: any;
  let url = getSlotUrl;
  if (token === '') {
    headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'hi_IN',
    };
    url = getSlotUrl;
  } else {
    headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'hi_IN',
      Authorization: `Bearer ${token}`,
    };
    url = getSlotsProtectedUrl;
  }
  console.log(`Slot url: ${url}`);
  try {
    const response = await api({
      url: url,
      method: 'get',
      headers: headers,
      params: params,
    });

    if (response) {
      if (response.data.centers) {
        response.data.centers.forEach((element: Center) => {
          element.data = element.sessions;
        });
        return response.data.centers;
      }
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
    console.log('current api count: ' + count);
    console.log(`stopped after duration: ${Date.now() - start}`);
  }
  return undefined;
};

export const getBeneficieryDetails = async (
  token: string,
): Promise<Array<Beneficiary> | undefined> => {
  console.log(`TOKEN: ${token}`);

  try {
    const response = await api({
      url: getBeneficieryDetailsUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      response.data.beneficiaries.forEach((element: Beneficiary) => {
        element.data = element.appointments;
      });
      return response.data.beneficiaries;
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }

  return undefined;
};

export const getCaptcha = async (token: string) => {
  try {
    const response = await api({
      url: getCaptchaUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      return response.data.captcha;
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }

  return undefined;
};

export const bookAppointment = async (
  token: string,
  dose: number,
  sessionId: string,
  slot: string,
  beneficiaries: Array<string>,
  captcha: string,
): Promise<string | undefined> => {
  console.log(sessionId);
  console.log(slot);
  console.log(beneficiaries);
  console.log(captcha);
  try {
    const response = await api({
      url: bookAppointmentUrl,
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        dose: dose,
        session_id: sessionId,
        slot: slot,
        beneficiaries: beneficiaries,
        captcha: captcha,
      },
    });
    if (response) {
      console.log(response);
      if (response.status === 409) {
        return `Error: This vaccination center is completely booked for the selected date.`;
      }
      return response.data.appointment_confirmation_no;
    }
  } catch (error) {
    console.error(`ERRPR: ${error}`);
  }
  return undefined;
};

export const cancelBooking = async (
  token: string,
  appointmentId: string,
  beneficiaries: string[],
): Promise<any | undefined> => {
  console.log('what?');
  console.log(beneficiaries);
  console.log(appointmentId);
  try {
    const response = await api({
      url: cancelAppointment,
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        appointment_id: appointmentId,
        beneficiariesToCancel: beneficiaries,
      },
    });
    if (response) {
      console.log('Cancel Booking response: ');
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error(`ERRPR: ${error}`);
  }
  return undefined;
};

export const getDistricts = async (
  stateId: number,
): Promise<DISTRICT[] | undefined> => {
  try {
    const response = await api({
      url: getDistrictsUrl + '/' + stateId,
      method: 'get',
      headers: {
        accept: 'application/json',
        'Accept-Language': 'hi_IN',
      },
    });
    if (response) {
      return response.data.districts;
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
  return undefined;
};
