import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountOperatorContext } from '../context/TableAccountOperatorContext';

import Spacer from '../components/Spacer';


const OperatorTableAccountsScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const operatedVenue = userContext.state.selectedOperationalVenue;
  const tableAccountOperatorContext = useContext(TableAccountOperatorContext);
  const { loadTableAccounts } = tableAccountOperatorContext;
  const [tableAccountsLoading, setTableAccountsLoading] = useState(false);

  const handleLoadAccounts = async () => {
    setTableAccountsLoading(true);
    await loadTableAccounts(operatedVenue.id);
    setTableAccountsLoading(false);
  };

  useEffect(() => {
    async function init() {
      await handleLoadAccounts();
    }
    init();
  }, []);

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text h4>Table Accounts</Text>
        <Text h5>{operatedVenue.name}</Text>
      </Spacer>

      {
        tableAccountsLoading
          ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#90002D" />
            </View>
          )
          : (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              data={tableAccountOperatorContext.state.operatedTableAccounts}
              renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column', margin: 3, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'stretch', }}>
                  <TouchableOpacity onPress={() => navigation.navigate("OperatorTableOrders", { tableAccount: item })}>
                    <View style={{ height: '100%', backgroundColor: `#${item.id.substring(0, 6)}33`, padding: 10 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginHorizontal: 6, alignSelf: 'stretch' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Table - {item.table && item.table.name ? item.table.name : item.id.substring(0, 8)}</Text>
                          {
                            item.status == 1 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'gray' }}>New</Text> : (
                              item.status == 2 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'yellow' }}>Awaiting approvement</Text> : (
                                item.status == 3 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'gray' }}>Idle</Text> : (
                                  item.status == 4 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00ab38' }}>Order ready</Text> : (
                                    item.status == 5 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'orange' }}>Needs attention</Text> : (
                                      item.status == 6 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'orange' }}>Asking to pay</Text> : (
                                        item.status == 7 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'Black' }}>Closed</Text>
                                          : <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'gray' }}>Unknown</Text>))))))
                          }
                        </View>
                        {
                          item.status == 2
                            ? (
                              <View style={{ marginHorizontal: 6, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ backgroundColor: `#${item.id.substring(0, 6)}88`, padding: 10 }} onPress={() => { }}>
                                  <Text style={{ fontSize: 18 }}>Approve</Text>
                                </TouchableOpacity>
                              </View>
                            )
                            : null
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<View style={{ height: "100%", justifyContent: "center" }}><Text style={{ textAlign: 'center' }}>No table accounts found.</Text></View>}
              refreshControl={<RefreshControl refreshing={tableAccountsLoading} onRefresh={handleLoadAccounts} />}
              scrollEnabled={true}
              style={{ marginBottom: 80 }} />
          )
      }
    </SafeAreaView >
  );
};

export default OperatorTableAccountsScreen;