import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Session} from './../../Types/SlotTypes';

export const SessionListItem: React.FC<{
  session: Session;
  onSessionSelected: (session: Session) => void;
}> = ({session, onSessionSelected}) => {
  return (
    <TouchableOpacity
      style={SessionListStyles.containerView}
      onPress={() => onSessionSelected(session)}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text style={SessionListStyles.titleText}>Date:</Text>
          <Text style={SessionListStyles.vaccine}>{session.date}</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text style={SessionListStyles.titleText}>Age:</Text>
          <Text style={SessionListStyles.ageLimit}>
            {session.min_age_limit}+
          </Text>
          <Text style={SessionListStyles.titleText}>Vaccine Available:</Text>
          <Text style={SessionListStyles.vaccine}>{session.vaccine}</Text>
          <Text style={SessionListStyles.capacity}>
            {session.available_capacity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SessionListStyles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#808080',
  },
  vaccine: {
    fontSize: 14,
    fontWeight: '600',
    marginStart: 6,
  },
  ageLimit: {
    marginHorizontal: 8,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    height: 16,
  },
  capacity: {
    backgroundColor: '#56a638',
    marginHorizontal: 8,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    height: 16,
    textAlign: 'center',
  },
});
