import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountOperatorContext } from '../context/TableAccountOperatorContext';
import { venueHostService } from '../services/websockets/venueHostService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import Spacer from '../components/Spacer';


const OperatorTableAccountsScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const operatedVenue = userContext.state.selectedOperationalVenue;
  const tableAccountOperatorContext = useContext(TableAccountOperatorContext);
  const { loadTableAccounts, setOperatedTableAccount } = tableAccountOperatorContext;
  const [tableAccountsLoading, setTableAccountsLoading] = useState(false);
  const [itemsUnderApprovalIds, setItemsUnderApprovalIds] = useState([]);

  const handleLoadAccounts = async () => {
    setTableAccountsLoading(true);
    const tableRegionIds = userContext.state.user.tableRegionUsers && userContext.state.user.tableRegionUsers.length
      ? userContext.state.user.tableRegionUsers.map(x => x.tableRegionId)
      : [];
    await loadTableAccounts(operatedVenue.id, tableRegionIds);
    setTableAccountsLoading(false);
  };

  const handleSetAccountIdle = (tableAccountId) => {
    setItemsUnderApprovalIds([...itemsUnderApprovalIds, tableAccountId]);
    const username = userContext.state.user.username;
    venueHostService.invokeUpdateTableAccountStatus({ tableAccountId, newStatus: 3, updaterUsername: username });
  };

  // ACCOUNTS HUB
  const handleAccountStatusChange = (result) => {
    console.log('handleAccountStatusChange');
    // console.log(result.TableAccount)

    setItemsUnderApprovalIds(itemsUnderApprovalIds.filter(x => x != result.tableAccount.id));
    setOperatedTableAccount(result.tableAccount);

    if (result.needsItemsStatusUpdate)
      venueHostService.invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged(result.tableAccount.id);

    // console.log('Vibrate device for Account Status Update...');
    // TODO: Vibrate device for Account Status Update.
  };
  const handleAccountsHubSubscriptions = () => {
    const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
    accountsHubConnection.on('AccountStatusChanged', handleAccountStatusChange);

    venueHostService.invokeAccountsHubConnectedAsVenueHost(operatedVenue.id);
  };

  // ORDERS HUB
  const handleAccountHasItemStatusChanged = (result) => {
    console.log('Venue Host - AccountHasItemStatusChanged');
  };
  const handleOrdersHubSubscriptions = () => {
    const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
    if (ordersHubConnection) {
      ordersHubConnection.on('AccountHasItemStatusChanged', handleAccountHasItemStatusChanged);
      venueHostService.invokeOrdersHubConnectedAsVenueHost(operatedVenue.id);
    }
  };

  useEffect(() => {
    async function init() {
      await handleLoadAccounts();

      handleOrdersHubSubscriptions();
      handleAccountsHubSubscriptions();
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
              renderItem={({ item }) => {
                const bgColorTiles = `#${item.id.substring(0, 6)}DD`;
                return (
                  <View style={{ flex: 1, borderRadius: 20, flexDirection: 'column', margin: 3, backgroundColor: bgColorTiles, justifyContent: 'center', alignItems: 'stretch', }}>
                    <TouchableOpacity disabled={item.status < 3} onPress={() => navigation.navigate("OperatorTableOrders", { tableAccount: item })}>
                      <View style={{ height: '100%', padding: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ marginHorizontal: 6, alignSelf: 'stretch' }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Table - {item.table && item.table.name ? item.table.name : item.id.substring(0, 8)}</Text>
                            {
                              item.status == 1 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF11' }}>New</Text> : (
                                item.status == 2 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF33' }}>Awaiting approvement</Text> : (
                                  item.status == 3 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF55' }}>Idle</Text> : (
                                    item.status == 4 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF77' }}>Ready to be delivered</Text> : (
                                      item.status == 5 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF99' }}>Needs attention</Text> : (
                                        item.status == 6 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFFBB' }}>Asking to pay</Text> : (
                                          item.status == 7 ? <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>Closed</Text>
                                            : <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'lightgray' }}>Unknown</Text>))))))
                            }
                          </View>
                          {
                            item.status == 2 || item.status == 5 || item.status == 6
                              ? (
                                <View style={{ marginHorizontal: 6, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                  <TouchableOpacity
                                    style={{ width: 90, borderRadius: 20, backgroundColor: `#FFFFFF88`, padding: 10 }}
                                    onPress={() => handleSetAccountIdle(item.id)}
                                    disabled={itemsUnderApprovalIds.filter(x => x == item.id).length > 0}>
                                    {
                                      itemsUnderApprovalIds.filter(x => x == item.id).length
                                        ? <ActivityIndicator size="small" color={"white"} animating={true} />
                                        : <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>{item.status == 2 ? "Approve" : "OK"}</Text>
                                    }
                                  </TouchableOpacity>
                                </View>
                              )
                              : null
                          }
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }}
              ListEmptyComponent={<View style={{ height: "100%", justifyContent: "center" }}><Text style={{ textAlign: 'center' }}>No table accounts found.</Text></View>}
              refreshControl={<RefreshControl refreshing={tableAccountsLoading} onRefresh={handleLoadAccounts} />}
              scrollEnabled={true}
              style={{ marginBottom: 80 }} />
          )
      }
    </SafeAreaView>
  );
};

export default OperatorTableAccountsScreen;