import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export type RadioOption = {
  key: string;
  text: string;
};

export const RadioButton: React.FC<{
  options: Array<RadioOption>;
  onChange: (value: string) => void;
  selectedKey: string;
}> = props => {
  const [value, setValue] = useState(props.selectedKey);
  return (
    <View style={{flexDirection: 'row'}}>
      {props.options.map(res => {
        return (
          <View key={res.key} style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                setValue(res.key);
                props.onChange(res.key);
              }}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View style={styles.radioCircle}>
                  {value === res.key ? (
                    <View style={styles.selectedRb} />
                  ) : null}
                </View>
                <Text style={styles.radioText}>{res.text}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    margin: 8,
    borderColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: '#3740ff',
  },
});
