import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  AgeFilters,
  AvailableVaccineTypes,
  DISTRICT,
  DoseChoices,
  FeeTypeChoices,
  STATE,
  STATES,
} from '../../Constants/Constants';
import {RootStackParamList} from '../../Navigation/RootStackParams';
import {
  getUserAgePreference,
  getUserDistrictIdPreference,
  getUserDosePreference,
  getUserFeeTypePreference,
  getUserLoginPreference,
  getUserPincodePreference,
  getUserStateIdPreference,
  getUserVaccinePreference,
  saveUserAgePreference,
  saveUserDistrictIdPreference,
  saveUserDosePreference,
  saveUserLoginPreference,
  saveUserPincodePreference,
  saveUserStateIdPreference,
  saveUserStatePreference,
  saveUserVaccinePreference,
} from '../../Storage/LocalStorage';
import {RadioButton} from '../RadioButton/RadioButton';
import {renderBeneficiary} from '../SlotListScreen/SlotListScreen';
import {ScrollView} from 'react-native-gesture-handler';
import {getDistricts} from '../../API/APIHelper';
import {useSlots} from '../../App';

type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'SettingsScreen'>;

export enum VaccineType {
  COVISHIELD,
  COVAXIN,
  BOTH,
}

export enum AgeGroup {
  AgeAbove18,
  AgeAbove45,
}

export enum FeeType {
  FREE,
  PAID,
  BOTH,
}

export namespace AgeGroup {
  export const displayValue = (group: AgeGroup): string => {
    switch (group) {
      case AgeGroup.AgeAbove18:
        return '18+';
      case AgeGroup.AgeAbove45:
        return '45+';
    }
  };
  export const minAge = (group: AgeGroup): number => {
    switch (group) {
      case AgeGroup.AgeAbove18:
        return 18;
      case AgeGroup.AgeAbove45:
        return 45;
    }
  };
  export const group = (key: string): AgeGroup => {
    console.log('Key' + key);
    console.log(minAge(AgeGroup.AgeAbove18));
    if (key == minAge(AgeGroup.AgeAbove18).toString()) {
      return AgeGroup.AgeAbove18;
    } else {
      return AgeGroup.AgeAbove45;
    }
  };
}

export const SettingsScreen = () => {
  const route = useRoute<SettingsScreenRouteProp>();
  const {
    ageFilter,
    setAgeFilter,
    selectedVaccine,
    setSelectedVaccine,
    selectedDistrict,
    setSelectedDistrict,
    selectedState,
    setSelectedState,
    selectedDose,
    setSelectedDose,
    selectedFeeType,
    setSelectedFeeType,
    shouldAutoLogin,
    setShouldAutoLogin,
    setPincode,
  } = useSlots();

  const selectedBens = route.params.beneficiaries;

  const [stateList, setStateList] = useState<STATE[]>([]);
  const [districtList, setDistrictList] = useState<DISTRICT[]>([]);
  const [userInputPincode, setUserInputPincode] = useState('');

  useEffect(() => {
    getUserAgePreference().then(age => {
      if (age) {
        setAgeFilter(age.toString());
      }
    });
    getUserVaccinePreference().then(vaccineString => {
      if (vaccineString) {
        const newType = VaccineType[vaccineString as keyof typeof VaccineType];
        setSelectedVaccine(newType);
      }
    });
    getUserDosePreference().then(dose => {
      if (dose) {
        setSelectedDose(dose);
      }
    });
    getUserFeeTypePreference().then(feeTypeString => {
      if (feeTypeString) {
        const newType = FeeType[feeTypeString as keyof typeof FeeType];
        setSelectedFeeType(newType);
      }
    });
    getUserStateIdPreference().then(st => {
      if (st) {
        setSelectedState(st);
        getDistricts(st).then(dList => {
          if (dList) {
            setDistrictList(dList);
          }
        });
      }
      setStateList(STATES);
    });
    getUserDistrictIdPreference().then(dt => {
      if (dt) {
        setSelectedDistrict(+dt);
      }
    });
    getUserLoginPreference().then(login => {
      if (login !== undefined) {
        setShouldAutoLogin(login);
      }
    });
    getUserPincodePreference().then(code => {
      if (code) {
        setPincode(code);
        setUserInputPincode(code.toString());
      }
    });
  }, []);

  const onAgeFilterChange = (key: string) => {
    if (key !== ageFilter) {
      setAgeFilter(key);
    }
    const agePref = AgeGroup.minAge(AgeGroup.group(key));
    saveUserAgePreference(agePref);
  };

  const onVaccineChange = (key: string) => {
    if (key !== VaccineType[selectedVaccine]) {
      const newType = VaccineType[key as keyof typeof VaccineType];
      setSelectedVaccine(newType);
      saveUserVaccinePreference(VaccineType[newType]);
    }
  };

  const onDoseChange = (key: string) => {
    if (key !== selectedDose.toString()) {
      setSelectedDose(+key);
    }
    saveUserDosePreference(+key);
  };

  const onFeeTypeChange = (key: string) => {
    if (key !== FeeType[selectedFeeType]) {
      const newType = FeeType[key as keyof typeof FeeType];
      setSelectedFeeType(newType);
    }
  };

  const onStateChange = (index: number) => {
    const currentState = stateList[index];
    setSelectedState(currentState.state_id);
    setDistrictList([]);
    // Get District
    getDistricts(currentState.state_id).then(dList => {
      if (dList) {
        setDistrictList(dList);
      }
    });
    saveUserStateIdPreference(currentState.state_id);
    saveUserStatePreference(currentState.state_name);
  };

  const onDistrictChange = (index: number) => {
    const currentDistrict = districtList[index];
    setSelectedDistrict(currentDistrict.district_id);
    saveUserDistrictIdPreference(currentDistrict.district_id);
  };

  const toggleSwitch = (previousState: boolean) => {
    setShouldAutoLogin(previousState);
    saveUserLoginPreference(previousState);
  };

  const onPincodeChange = (text: string) => {
    console.log('INPUT: ', text);
    setUserInputPincode(text);
    if (text.length === 6) {
      console.log('will change pin');
      setPincode(+text);
      saveUserPincodePreference(+text);
    } else {
      setPincode(0);
      saveUserPincodePreference(undefined);
    }
  };

  return (
    <View style={Styles.container}>
      {selectedBens.length > 0 ? (
        <View>
          <Text>Booking For:</Text>
          {renderBeneficiary(selectedBens)}
        </View>
      ) : null}
      <ScrollView>
        <Text>
          Below settings would be used to make it faster to book the slot
          whenever available!
        </Text>
        <View>
          <Text>
            Do you want to stay logged in? You will get notification to enter
            OTP in every 15 mins.
          </Text>
          <View style={Styles.radioContainer}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={shouldAutoLogin}
            />
          </View>
        </View>
        <View>
          <Text>Select Dose</Text>
          <View style={Styles.radioContainer}>
            <RadioButton
              key={selectedDose}
              selectedKey={selectedDose.toString()}
              options={DoseChoices}
              onChange={onDoseChange}
            />
          </View>
        </View>
        <View>
          <Text>Select Vaccine</Text>
          <View style={Styles.radioContainer}>
            <RadioButton
              key={selectedVaccine}
              selectedKey={VaccineType[selectedVaccine]}
              options={AvailableVaccineTypes}
              onChange={onVaccineChange}
            />
          </View>
        </View>
        <View>
          <Text>Select Age group to get Alerts</Text>
          <View style={Styles.radioContainer}>
            <RadioButton
              key={ageFilter}
              selectedKey={ageFilter}
              options={AgeFilters}
              onChange={onAgeFilterChange}
            />
          </View>
        </View>
        <View>
          <Text>Select Fee Type</Text>
          <View style={Styles.radioContainer}>
            <RadioButton
              key={selectedFeeType}
              selectedKey={FeeType[selectedFeeType]}
              options={FeeTypeChoices}
              onChange={onFeeTypeChange}
            />
          </View>
        </View>
        <View>
          <Text>Select State</Text>
          <View style={Styles.pickerContainer}>
            <Picker
              key={selectedState}
              mode="dropdown"
              testID="state-picker"
              selectedValue={selectedState}
              onValueChange={(itemValue, itemIndex) =>
                onStateChange(itemIndex)
              }>
              {stateList.map(i => {
                return (
                  <Picker.Item
                    key={i.state_id}
                    label={i.state_name}
                    value={i.state_id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
        {districtList.length > 0 ? (
          <View>
            <Text>Select District</Text>
            <View style={Styles.pickerContainer}>
              <Picker
                key={selectedDistrict}
                mode="dropdown"
                testID="district-picker"
                selectedValue={selectedDistrict}
                onValueChange={(itemValue, itemIndex) =>
                  onDistrictChange(itemIndex)
                }>
                {districtList.map(i => {
                  return (
                    <Picker.Item
                      key={i.district_id}
                      label={i.district_name}
                      value={i.district_id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        ) : null}
        <View>
          <Text>(Optional) Select Pincode</Text>
          <TextInput
            keyboardType="phone-pad"
            placeholder="Pincode"
            placeholderTextColor="#c4c3cb"
            style={[
              Styles.loginFormTextInput,
              {color: userInputPincode.length === 6 ? '#000000' : 'red'},
            ]}
            onChangeText={onPincodeChange}
            value={userInputPincode}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#808080',
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    color: '#000000',
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
});
