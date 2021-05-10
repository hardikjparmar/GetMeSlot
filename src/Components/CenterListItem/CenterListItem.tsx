import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Center} from './../../Types/SlotTypes';

export const CenterListItem: React.FC<{
  center: Center;
}> = ({center}) => {
  const renderViews = () => {
    return center.vaccine_fees.map((item, index) => {
      return (
        <View key={index} style={{flexDirection: 'row', paddingEnd: 12}}>
          <Text>{item.vaccine}:</Text>
          <Text style={CenterListStyles.price}>₹{item.fee}</Text>
        </View>
      );
    });
  };

  return (
    <View style={CenterListStyles.containerView}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={CenterListStyles.titleText}>{center.name}</Text>
        <Text style={CenterListStyles.feeType}>{center.fee_type}</Text>
      </View>
      <Text style={CenterListStyles.address}>
        {center.address}, {center.district_name}, {center.state_name},{' '}
        {center.pincode}
      </Text>
      {center.fee_type === 'Paid' ? (
        <View style={{flexDirection: 'row', paddingTop: 12}}>
          {renderViews()}
        </View>
      ) : null}
    </View>
  );
};

const CenterListStyles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopEndRadius: 6,
    borderTopStartRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    fontSize: 13,
    fontWeight: '400',
    color: '#808080',
  },
  feeType: {
    marginHorizontal: 8,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: '#2152b3',
    color: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    height: 16,
    textAlign: 'center',
  },
  price: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#56a638',
    height: 16,
  },
});
