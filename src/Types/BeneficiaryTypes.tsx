export type Beneficiary = {
  appointments: [Appointment];
  beneficiary_reference_id: string;
  birth_year: string;
  comorbidity_ind: string;
  dose1_date: string;
  dose2_date: string;
  gender: string;
  mobile_number: string;
  name: string;
  photo_id_number: string;
  photo_id_type: string;
  vaccination_status: string;
  vaccine: string;
  data: [Appointment];
  isSelected: boolean;
};

export type Appointment = {
  appointment_id: string;
  block_name: string;
  center_id: number;
  date: string;
  district_name: string;
  dose: number;
  from: string;
  name: string;
  session_id: string;
  slot: string;
  state_name: string;
  to: string;
};
