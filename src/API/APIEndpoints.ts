export const baseUrl = 'https://cdn-api.co-vin.in/api';
export const generateOTP = `/v2/auth/generateMobileOTP`;
export const confirmOTP = `/v2/auth/validateMobileOtp`;
// const getSlotUrl =
//   'https://api.demo.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=395&date=06-05-2021';
// 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=395&date=06-05-2021';
//   'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=395&date=06-05-2021';
export const getSlots = `/v2/appointment/sessions/calendarByDistrict`;
export const getBeneficieryDetails = `/v2/appointment/beneficiaries`;
export const bookAppointment = '/v2/appointment/schedule';
export const getCaptcha = '/v2/auth/getRecaptcha';
export const cancelAppointment = '/v2/appointment/cancel';
