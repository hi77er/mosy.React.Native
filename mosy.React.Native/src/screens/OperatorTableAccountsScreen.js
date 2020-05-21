import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountsContext } from '../context/TableAccountsContext';

import Spacer from '../components/Spacer';


const OperatorTableAccountsScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const operatedVenue = userContext.state.selectedOperationalVenue;
  const tableAccountsContext = useContext(TableAccountsContext);
  const { loadTableAccounts } = tableAccountsContext;

  useEffect(
    () => {
      loadTableAccounts(operatedVenue.id);
    }
    , []);


  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      {console.log(tableAccountsContext.state)}
      <Spacer>
        <Text h3>
          Table Accounts
        </Text>
      </Spacer>

      <FlatList
        scrollEnabled={true}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 3,
              height: 80,
              backgroundColor: 'lightgray',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate("OperatorTableOrders")}>

              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item}</Text>
              </View>

            </TouchableOpacity>
          </View>
        )}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default OperatorTableAccountsScreen;