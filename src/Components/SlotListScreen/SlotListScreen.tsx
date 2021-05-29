import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  Text,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';

import {CenterListItem} from '../CenterListItem/CenterListItem';
import {
  getBeneficiaryList,
  checkLoginSessionExpired,
} from '../../Storage/LocalStorage';
import {RootStackParamList} from './../../Navigation/RootStackParams';
import {SessionListItem} from '../SessionListItem/SessionListItem';
import {Center, Session} from '../../Types/SlotTypes';
import {today} from '../../DateHelper/DateHelper';
import {Beneficiary} from '../../Types/BeneficiaryTypes';
import {useSlots} from '../../App';
import {AgeGroup, FeeType, VaccineType} from '../SettingsScreen/SettingsScreen';
import {getSlots} from '../../API/APIHelper';

type SlotListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SlotListScreen'
>;
type SlotListScreenRouteProp = RouteProp<RootStackParamList, 'SlotListScreen'>;

export const renderBeneficiary = (selectedBens: Beneficiary[]) => {
  return selectedBens.map(i => {
    return <Text key={i.beneficiary_reference_id}>{i.name}</Text>;
  });
};

const SlotListScreen = () => {
  const {
    centers,
    ageFilter,
    selectedDistrict,
    selectedFeeType,
    selectedVaccine,
    selectedDose,
    pincode,
  } = useSlots();

  const navigation = useNavigation<SlotListScreenNavigationProp>();
  const route = useRoute<SlotListScreenRouteProp>();

  const token = route.params.token;
  const [dataList, setDataList] = useState<Array<Center>>([]);
  const [displayList, setDisplayList] = useState<Array<Center>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedBens, setSelectedBens] = useState<Array<Beneficiary>>([]);

  useLayoutEffect(() => {
    checkLoginSessionExpired().then(isLoginExpired => {
      if (isLoginExpired) {
        navigation.setOptions({
          headerRight: () => (
            <View style={{marginRight: 12}}>
              <Button onPress={onLoginPressed} title="Login" />
            </View>
          ),
        });
      } else {
        navigation.setOptions({
          headerRight: () => (
            <View style={{marginRight: 12}}>
              <Button onPress={onBeneficiaryPressed} title="Edit Members" />
            </View>
          ),
        });
      }
    });
  });

  useEffect(() => {
    getSavedBeneficiaryList();
  }, []);

  useEffect(() => {
    setDataList(centers);
    onAgeFilterChange(ageFilter);
  }, [centers]);

  const getSavedBeneficiaryList = () => {
    getBeneficiaryList().then(benList => {
      if (benList) {
        setSelectedBens(benList);
      }
    });
  };

  const onBeneficiaryPressed = () => {
    navigation.navigate('BeneficiaryListScreen', {
      token: token,
      onBeneficiarySelected: onBeneficiarySelected,
    });
  };

  const onLoginPressed = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoginScreen',
        },
      ],
    });
  };

  const getSlotsConsumer = (districtId: string, date: string) => {
    const vaccineParam =
      selectedVaccine !== VaccineType.BOTH
        ? VaccineType[selectedVaccine]
        : undefined;
    getSlots(districtId, date, token, vaccineParam)
      .then(response => {
        if (response) {
          setDataList(response);
          onAgeFilterChange(ageFilter);
        }
      })
      .catch(error => {
        console.error(`ERROR: ${error}`);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    getSlotsConsumer(selectedDistrict.toString(), today());
  };

  const onAgeFilterChange = (key: string) => {
    const minAge = AgeGroup.minAge(AgeGroup.group(key));
    const filteredList = dataList.filter(item => {
      return (
        item.sessions.filter(
          session =>
            (selectedDose == 2
              ? session.available_capacity_dose2 > 0
              : session.available_capacity_dose1 > 0) &&
            session.min_age_limit === minAge,
        ).length > 0 &&
        (selectedFeeType !== FeeType.BOTH
          ? item.fee_type.toLowerCase() ===
            FeeType[selectedFeeType].toLowerCase()
          : true) &&
        (pincode && pincode.toString().length === 6
          ? item.pincode === pincode
          : true)
      );
    });
    setDisplayList(filteredList);
  };

  const onSessionSelected = (session: Session) => {
    checkLoginSessionExpired().then(isLoginExpired => {
      if (isLoginExpired) {
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginScreen'}],
        });
      } else {
        // Book this slot
        navigation.navigate('BookingScreen', {
          token: token,
          session: session,
          selectedBens: selectedBens,
        });
      }
    });
  };

  const onBeneficiarySelected = (beneficiary: Array<Beneficiary>) => {
    setSelectedBens(beneficiary);
    setIsFetching(true);
    getSlotsConsumer(selectedDistrict.toString(), today());
  };

  const onSettingsPressed = () => {
    navigation.navigate('SettingsScreen', {beneficiaries: selectedBens});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {selectedBens.length > 0 ? (
        <View style={{padding: 16}}>
          <Text>Booking For:</Text>
          {renderBeneficiary(selectedBens)}
        </View>
      ) : null}
      <SectionList
        sections={displayList}
        keyExtractor={(item, index) => item.session_id.toString() + index}
        renderItem={info => (
          <SessionListItem
            key={info.item.session_id}
            session={info.item}
            onSessionSelected={onSessionSelected}
          />
        )}
        renderSectionHeader={section => (
          <CenterListItem
            key={section.section.center_id}
            center={section.section}
          />
        )}
        ListEmptyComponent={() => (
          <View key="emptyView" style={ListStyles.emptyContainer}>
            <Text>No Slots Available for this Age Group</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={ListStyles.contentContainer}
        style={ListStyles.list}
        onRefresh={() => onRefresh()}
        refreshing={isFetching}
      />
      <TouchableOpacity
        style={ListStyles.floatingContainer}
        onPress={onSettingsPressed}>
        <Image
          style={ListStyles.floatingImage}
          resizeMethod="resize"
          resizeMode="center"
          source={require('./../../Assets/settings_icon.png')}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SlotListScreen;

const ListStyles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 16,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    backgroundColor: 'steelblue',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    elevation: 8,
  },
  floatingImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
});
