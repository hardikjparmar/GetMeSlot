import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Appointment} from './../../Types/BeneficiaryTypes';

export const AppointmentListItem: React.FC<{
  appointment: Appointment;
}> = ({appointment}) => {
  return (
    <View style={AppointmentListItemStyles.container}>
      <View style={AppointmentListItemStyles.seperator} />
      <View style={AppointmentListItemStyles.childContainer}>
        <Text>Dose:</Text>
        <Text style={AppointmentListItemStyles.center}>{appointment.dose}</Text>
      </View>
      <View style={AppointmentListItemStyles.childContainer}>
        <Text>Slot:</Text>
        <Text style={AppointmentListItemStyles.center}>
          {appointment.slot} on {appointment.date}
        </Text>
      </View>
      <View style={AppointmentListItemStyles.childContainer}>
        <Text>Center:</Text>
        <Text style={AppointmentListItemStyles.center}>{appointment.name}</Text>
      </View>
      <View style={AppointmentListItemStyles.childContainer}>
        <Text>Address:</Text>
        <Text style={AppointmentListItemStyles.address}>
          {appointment.block_name}, {appointment.district_name},{' '}
          {appointment.state_name}
        </Text>
      </View>
    </View>
  );
};

const AppointmentListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.clear,
  },
  childContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#808080',
    marginVertical: 8,
  },
  center: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginStart: 4,
  },
  address: {
    fontSize: 15,
    fontWeight: '400',
    color: '#808080',
    marginStart: 4,
    flexWrap: 'wrap',
  },
});
