import axios from 'axios';
import {sha256} from 'react-native-sha256';
import {
  baseUrl,
  confirmOTP,
  generateOTP,
  getSlots as getSlotUrl,
  getBeneficieryDetails as getBeneficieryDetailsUrl,
  bookAppointment as bookAppointmentUrl,
  getCaptcha as getCaptchaUrl,
  cancelAppointment,
} from './APIEndpoints';
import {removeCredentials} from '../Storage/LocalStorage';
import {Center} from '../Types/SlotTypes';
import Navigator from '../Navigation/RootNavigation';
import {Beneficiary} from '../Types/BeneficiaryTypes';

let api = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
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
          'U2FsdGVkX1+z/4Nr9nta+2DrVJSv7KS6VoQUSQ1ZXYDx/CJUkWxFYG6P3iM/VW+6jLQ9RDQVzp/RcZ8kbT41xw==',
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
  try {
    const response = await api({
      url: getSlotUrl,
      method: 'get',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'hi_IN',
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    if (response) {
      response.data.centers.forEach((element: Center) => {
        element.data = element.sessions;
      });
      return response.data.centers;
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

/**
 * curl -X POST "https://api.demo.co-vin.in/api/v2/appointment/schedule" -H "accept: application/json" -H "Content-Type: application/json" -H "x-api-key: 3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI2OTRkNmQ3MS0wY2FiLTRjNGMtYTk2Ni02NjRlZDRjNTc1NjEiLCJ1c2VyX2lkIjoiNjk0ZDZkNzEtMGNhYi00YzRjLWE5NjYtNjY0ZWQ0YzU3NTYxIiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo5NzI2MTg0ODM3LCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjIxMzk1NzA3Njg1NDIyLCJzZWNyZXRfa2V5IjoiYjVjYWIxNjctNzk3Ny00ZGYxLTgwMjctYTYzYWExNDRmMDRlIiwidWEiOiJNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMF8xKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMzkuMC4yMTcxLjk1IFNhZmFyaS81MzcuMzYiLCJkYXRlX21vZGlmaWVkIjoiMjAyMS0wNS0wOVQxNDoyMzo0MS4yNTVaIiwiaWF0IjoxNjIwNTcwMjIxLCJleHAiOjE2MjA1NzExMjF9.NV65xMZJFZg7vTcwHH8FSdMZF0qbM7-sCW3Gfo3YUvc" -d "{\"dose\":1,\"session_id\":\"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\"slot\":\"FORENOON\",\"beneficiaries\":[\"1234567890123\",\"9876543210987\"]}"
 */
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
