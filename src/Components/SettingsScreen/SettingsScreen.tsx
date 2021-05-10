import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  AgeFilters,
  AvailableVaccineTypes,
  DoseChoices,
  FeeTypeChoices,
  minAge,
} from '../../Constants/Constants';
import {RootStackParamList} from '../../Navigation/RootStackParams';
import {
  getUserAgePreference,
  getUserDosePreference,
  getUserFeeTypePreference,
  getUserVaccinePreference,
  saveUserAgePreference,
  saveUserDosePreference,
  saveUserVaccinePreference,
} from '../../Storage/LocalStorage';
import {RadioButton} from '../RadioButton/RadioButton';
import {renderBeneficiary} from '../SlotListScreen/SlotListScreen';

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

  const selectedBens = route.params.beneficiaries;

  const [selectedDose, setSelectedDose] = useState(1);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineType>(
    VaccineType.COVISHIELD,
  );
  const [ageFilter, setAgeFilter] = useState(minAge.toString());
  const [selectedFeeType, setSelectedFeeType] = useState(FeeType.BOTH);

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
    }
    console.log(selectedVaccine);
    saveUserVaccinePreference(VaccineType[selectedVaccine]);
  };

  const onDoseChange = (key: string) => {
    if (key !== selectedDose.toString()) {
      setSelectedDose(+key);
    }
    console.log(selectedDose);
    saveUserDosePreference(selectedDose);
  };

  const onFeeTypeChange = (key: string) => {
    if (key !== FeeType[selectedFeeType]) {
      const newType = FeeType[key as keyof typeof FeeType];
      setSelectedFeeType(newType);
    }
  };

  return (
    <View style={Styles.container}>
      {selectedBens.length > 0 ? (
        <View style={{padding: 16}}>
          <Text>Booking For:</Text>
          {renderBeneficiary(selectedBens)}
        </View>
      ) : null}
      <Text>
        Below settings would be used to make it faster to book the slot whenever
        available!
      </Text>
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
});
