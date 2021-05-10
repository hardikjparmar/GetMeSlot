import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Button,
} from 'react-native';
import {getBeneficieryDetails} from './../../API/APIHelper';
import {RootStackParamList} from './../../Navigation/RootStackParams';
import {Beneficiary} from './../../Types/BeneficiaryTypes';
import {BeneficiaryListItem} from './../BeneficiaryListItem/BeneficiaryListItem';
import {
  getBeneficiaryList,
  saveBeneficiaryList,
} from '../../Storage/LocalStorage';

type BeneficiaryListScreenRouteProp = RouteProp<
  RootStackParamList,
  'BeneficiaryListScreen'
>;

const BeneficiaryListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BeneficiaryListScreenRouteProp>();

  const token = route.params.token;
  const [dataList, setDataList] = useState<Array<Beneficiary>>([]);
  const [didFetchList, setDidFetchList] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const onBeneficiarySelected = route.params.onBeneficiarySelected;
  const [selectedBens, setSelectedBens] = useState<Array<Beneficiary>>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 12}}>
          <Button onPress={onDonePressed} title="Done" />
        </View>
      ),
    });
  });

  useEffect(() => {
    if (!didFetchList) {
      getSavedBeneficiaryList().then(() => {
        setDidFetchList(true);
        getBeneficiaryConsumer(token);
      });
    }
  });

  const getSavedBeneficiaryList = async (): Promise<undefined> => {
    try {
      const selBens = await getBeneficiaryList();
      if (selBens) {
        setSelectedBens(selBens);
      }
    } catch (err) {
      console.log(err);
    }
    return undefined;
  };

  const onDonePressed = () => {
    console.log(selectedBens);
    if (onBeneficiarySelected) {
      saveBeneficiaryList(selectedBens);
      onBeneficiarySelected(selectedBens);
    }
    navigation.goBack();
  };

  const getBeneficiaryConsumer = (token: string) => {
    getBeneficieryDetails(token)
      .then(response => {
        if (response) {
          const tempList = response;
          const newList = Array<Beneficiary>();
          tempList.forEach(item => {
            const index = selectedBens.indexOf(item);
            console.log(index);
            item.isSelected = index !== -1;
            newList.push(item);
          });
          setDataList(newList);
          const newBList = newList.filter(item => item.isSelected);
          setSelectedBens(newBList);
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
    getBeneficieryDetails(token);
  };

  const onBeneficiarySelectedFromList = (beneficiary: Beneficiary) => {
    const tempArr = selectedBens;
    let isSelected = false;
    const index = tempArr.indexOf(beneficiary);
    if (index !== -1) {
      tempArr.splice(index, 1);
      isSelected = false;
    } else {
      isSelected = true;
      tempArr.push(beneficiary);
    }
    setSelectedBens(tempArr);
    const tempDataList = dataList;
    const i = tempDataList.indexOf(beneficiary);
    if (i !== -1) {
      tempDataList[i].isSelected = isSelected;
    }
    setDataList(tempDataList);
    setRefreshData(!refreshData);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={dataList}
        extraData={selectedBens}
        keyExtractor={item => item.beneficiary_reference_id}
        renderItem={info => (
          <BeneficiaryListItem
            onBeneficiarySelected={onBeneficiarySelectedFromList}
            key={info.item.beneficiary_reference_id}
            beneficiary={info.item}
          />
        )}
        ListEmptyComponent={() => (
          <View
            key="123"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>
              Have not added any Beneficiary!? Do that ASAP on cowin portal!
            </Text>
          </View>
        )}
        ListFooterComponent={() => <View key="footer" style={{height: 16}} />}
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={ListStyles.contentContainer}
        style={ListStyles.list}
        onRefresh={() => onRefresh()}
        refreshing={isFetching}
      />
    </SafeAreaView>
  );
};

export default BeneficiaryListScreen;

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
});
