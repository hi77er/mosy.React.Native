import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountCustomerContext } from '../context/TableAccountCustomerContext';
import { accountOpenerService } from '../services/websockets/accountOpenerService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';


import Spacer from '../components/Spacer';

const connectingAsAccountOpener = "accountopener";

const ClientTableOrdersScreen = ({ navigation }) => {
  const tableAccount = navigation.state.params.tableAccount;
  const userContext = useContext(UserContext);
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { loadOrders, setOrderItem } = tableAccountCustomerContext;
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLoadOrders = async () => {
    setOrdersLoading(true);
    await loadOrders(tableAccount.id || tableAccount.Id).catch(e => console.log(e.response));
    setOrdersLoading(false);
  };

  // ORDERS HUB
  const handleOrderItemStatusChanged = (result) => {
    console.log('Opener - OrderItemStatusChanged');
    setOrderItem(result);
  };

  useEffect(() => {
    async function init() {
      const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection(connectingAsAccountOpener);
      ordersHubConnection.on('OrderItemStatusChanged', handleOrderItemStatusChanged);

      await handleLoadOrders();
    }
    init();
  }, []);

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text h4>Orders</Text>
        <Text h5>{(tableAccount.id || tableAccount.Id).substring(0, 8)}</Text>
      </Spacer>
      {
        ordersLoading
          ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#90002D" />
            </View>
          )
          : (
            tableAccountCustomerContext.state.tableAccount
              && (
                (tableAccountCustomerContext.state.tableAccount.orders && tableAccountCustomerContext.state.tableAccount.orders.length) ||
                (tableAccountCustomerContext.state.tableAccount.Orders && tableAccountCustomerContext.state.tableAccount.Orders.length)
              )
              ? (
                <FlatList
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  data={tableAccountCustomerContext.state.tableAccount.orders || tableAccountCustomerContext.state.tableAccount.Orders}
                  renderItem={(orderProps) => {
                    const order = orderProps.item;
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          margin: 3,
                          backgroundColor: 'lightgray',
                          justifyContent: 'center',
                          alignItems: 'stretch',
                        }}>
                        <TouchableOpacity onPress={() => navigation.navigate("OperatorTableOrders")}>
                          <View style={{ height: '100%', padding: 2 }}>
                            <FlatList
                              keyExtractor={(item, index) => index.toString()}
                              data={order.orderRequestables || order.OrderRequestables}
                              renderItem={(orderItemProps) => {
                                const orderItem = orderItemProps.item;
                                return (
                                  <View style={{ margin: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                      {
                                        (orderItem.requestable || orderItem.Requestable).name || (orderItem.requestable || orderItem.Requestable).Name
                                      }
                                    </Text>
                                    {
                                      console.log(orderItem.Status)
                                    }
                                    {
                                      (orderItem.status == 1 || orderItem.Status == 1) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>New</Text> : (
                                        (orderItem.status == 2 || orderItem.Status == 2) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Awaiting account approval</Text> : (
                                          (orderItem.status == 3 || orderItem.Status == 3) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Received</Text> : (
                                            (orderItem.status == 4 || orderItem.Status == 4) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'yellow' }}>Being prepared</Text> : (
                                              (orderItem.status == 5 || orderItem.Status == 5) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>Ready to be taken</Text> : (
                                                (orderItem.status == 6 || orderItem.Status == 6) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>Being delivered</Text> : (
                                                  (orderItem.status == 7 || orderItem.Status == 7) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'darkgreen' }}>Delivered</Text> : (
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Unknown</Text>)))))))
                                    }
                                  </View>
                                );
                              }} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  refreshControl={<RefreshControl refreshing={ordersLoading} onRefresh={handleLoadOrders} />}
                  ListEmptyComponent={<View style={{ height: "100%", justifyContent: "center" }}><Text style={{ textAlign: 'center' }}>Table has still not ordered.</Text></View>}
                  scrollEnabled={true}
                  style={{ marginBottom: 80 }} />
              )
              : (
                <View style={{ height: "100%", justifyContent: "center" }}>
                  <Text style={{ textAlign: 'center' }}>Accounts still has no orders.</Text>
                </View>
              )
          )
      }
    </SafeAreaView>
  );
};

export default ClientTableOrdersScreen;