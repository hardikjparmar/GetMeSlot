import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {AppointmentListItem} from '../AppointmentListItem/AppointmentListItem';
import {Beneficiary} from './../../Types/BeneficiaryTypes';

const renderAppointments = (beneficiary: Beneficiary) => {
  return beneficiary.appointments.map(item => {
    return <AppointmentListItem key={item.appointment_id} appointment={item} />;
  });
};

export const BeneficiaryListItem: React.FC<{
  beneficiary: Beneficiary;
  onBeneficiarySelected: (beneficiary: Beneficiary) => void;
}> = ({beneficiary, onBeneficiarySelected}) => {
  return (
    <TouchableWithoutFeedback
      delayPressIn={0.1}
      style={[
        BeneficiaryListItemStyles.container,
        {backgroundColor: beneficiary.isSelected ? '#94e5ff' : '#fff'},
      ]}
      onPress={() => onBeneficiarySelected(beneficiary)}>
      <View style={BeneficiaryListItemStyles.vaccinationStatusContainer}>
        <Text style={BeneficiaryListItemStyles.vaccinationStatus}>
          {beneficiary.vaccination_status}
        </Text>
      </View>
      <Text style={BeneficiaryListItemStyles.name}>{beneficiary.name}</Text>
      {beneficiary.vaccine ? (
        <View style={BeneficiaryListItemStyles.childContainer}>
          <Text>Vaccine:</Text>
          <Text style={BeneficiaryListItemStyles.vaccine}>
            {beneficiary.vaccine}
          </Text>
        </View>
      ) : null}
      {beneficiary.dose1_date ? (
        <View style={BeneficiaryListItemStyles.childContainer}>
          <Text>Dose-1 on:</Text>
          <Text style={BeneficiaryListItemStyles.dose}>
            {beneficiary.dose1_date}
          </Text>
        </View>
      ) : null}
      {beneficiary.dose2_date ? (
        <View style={BeneficiaryListItemStyles.childContainer}>
          <Text>Dose-1 on:</Text>
          <Text style={BeneficiaryListItemStyles.dose}>
            {beneficiary.dose2_date}
          </Text>
        </View>
      ) : null}
      {renderAppointments(beneficiary)}
    </TouchableWithoutFeedback>
  );
};

const BeneficiaryListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  childContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  vaccinationStatusContainer: {
    flexDirection: 'row-reverse',
    marginTop: -12,
    marginStart: -13,
  },
  vaccinationStatus: {
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '400',
    backgroundColor: '#2152b3',
    color: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
  },
  dose: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vaccine: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#56a638',
    height: 16,
  },
});
