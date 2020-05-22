import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
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
  const [tableAccountsLoading, setTableAccountsLoading] = useState(false);

  const handleLoadAccounts = async () => {
    setTableAccountsLoading(true);
    await loadTableAccounts(operatedVenue.fboId);
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
            tableAccountsContext.state.operatedTableAccounts && tableAccountsContext.state.operatedTableAccounts.length
              ? (
                <FlatList
                  scrollEnabled={true}
                  data={tableAccountsContext.state.operatedTableAccounts}
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
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.table && item.table.name ? item.table.name : item.id.substring(0, 8)}</Text>

                          {
                            item.status == 1 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray', textAlign: 'center' }}>New</Text> : (
                              item.status == 2 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'yellow', textAlign: 'center' }}>Awaiting approvement</Text> : (
                                item.status == 3 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray', textAlign: 'center' }}>Idle</Text> : (
                                  item.status == 4 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#00ab38', textAlign: 'center' }}>Order ready</Text> : (
                                    item.status == 5 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'orange', textAlign: 'center' }}>Needs attention</Text> : (
                                      item.status == 6 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'orange', textAlign: 'center' }}>Asking to pay</Text> : (
                                        item.status == 7 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'Black', textAlign: 'center' }}>Closed</Text>
                                          : <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Unknown</Text>))))))
                          }

                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={<RefreshControl refreshing={tableAccountsLoading} onRefresh={handleLoadAccounts} />}
                  style={{ marginBottom: 80 }} />
              )
              : (
                <View style={{ height: "100%", justifyContent: "center" }}>
                  <Text style={{ textAlign: 'center' }}>No table accounts found.</Text>
                </View>
              )
          )
      }
    </SafeAreaView>
  );
};

export default OperatorTableAccountsScreen;