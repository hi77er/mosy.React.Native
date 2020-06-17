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


const ClientTableOrdersScreen = ({ navigation }) => {
  const tableAccount = navigation.state.params.tableAccount;
  const userContext = useContext(UserContext);
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { loadOrders, setOrderItem } = tableAccountCustomerContext;
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [askingToPay, setAskingToPay] = useState(false);
  const [requiringAttention, setRequiringAttention] = useState(false);

  const handleLoadOrders = async () => {
    setOrdersLoading(true);
    await loadOrders(tableAccount.id).catch(e => console.log(e.response));
    setOrdersLoading(false);
  };

  const handleAskToPay = async () => {
    setAskingToPay(true);
    // await loadOrders(tableAccount.id).catch(e => console.log(e.response));
    setAskingToPay(false);
  };

  const handleRequireAttention = async () => {
    setRequiringAttention(true);
    // await loadOrders(tableAccount.id).catch(e => console.log(e.response));
    setRequiringAttention(false);
  };

  // ORDERS HUB
  const handleOrderItemStatusChanged = (result) => {
    console.log('Opener - OrderItemStatusChanged');
    setOrderItem(result);
  };
  const handleOrdersHubSubscriptions = (result) => {
    const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
    ordersHubConnection.on('OrderItemStatusChanged', handleOrderItemStatusChanged);

    accountOpenerService.invokeOrdersHubConnectedAsAccountOpener();
  };

  useEffect(() => {
    async function init() {
      await handleLoadOrders();

      handleOrdersHubSubscriptions();
    }
    init();
  }, []);

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <View style={{ margin: 15 }}>
        <Text h4>Table Orders</Text>
        <Text h5>{(tableAccount.id).substring(0, 8)}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 8,
          marginVertical: 4,
          padding: 5,
          backgroundColor: 'lightgray',
          borderRadius: 20,
        }}>
        {
          tableAccount.status == 5
            ? (
              <View style={{ width: '100%', margin: 10 }}>
                <Text style={{ textAlign: 'center' }}>
                  You have asked for attention!
                </Text>
              </View>
            )
            : (
              tableAccount.status == 6
                ? (
                  <View style={{ width: '100%', margin: 10 }}>
                    <Text style={{ textAlign: 'center' }}>
                      You have asked to pay!
                    </Text>
                  </View>
                )
                : (
                  <React.Fragment>
                    <View style={{ flex: 1, margin: 5 }}>
                      <TouchableOpacity
                        style={{ borderRadius: 20, backgroundColor: 'gray', padding: 10 }}
                        onPress={() => handleRequireAttention()}
                        disabled={false}>
                        {
                          requiringAttention
                            ? <ActivityIndicator size="small" color="white" animating={true} />
                            : <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Call attention</Text>
                        }
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, margin: 5 }}>
                      <TouchableOpacity
                        style={{ borderRadius: 20, backgroundColor: 'gray', padding: 10 }}
                        onPress={() => handleAskToPay()}
                        disabled={false}>
                        {
                          askingToPay
                            ? <ActivityIndicator size="small" color="white" animating={true} />
                            : <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Ask to pay</Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                )
            )
        }

      </View>
      {
        ordersLoading
          ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#90002D" />
            </View>
          )
          : (
            tableAccountCustomerContext.state.tableAccount
              && tableAccountCustomerContext.state.tableAccount.orders
              && tableAccountCustomerContext.state.tableAccount.orders.length
              ? (
                <FlatList
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  data={tableAccountCustomerContext.state.tableAccount.orders}
                  renderItem={(orderProps) => {
                    const order = orderProps.item;
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          borderRadius: 20,
                          marginHorizontal: 8,
                          marginVertical: 4,
                          backgroundColor: '#90002d',
                          justifyContent: 'center',
                          alignItems: 'stretch',
                        }}>
                        <TouchableOpacity onPress={() => { }}>
                          <View style={{ height: '100%', padding: 16 }}>
                            <FlatList
                              keyExtractor={(item, index) => index.toString()}
                              data={order.orderRequestables}
                              renderItem={(orderItemProps) => {
                                const orderItem = orderItemProps.item;
                                return (
                                  <View style={{ marginVertical: 2, flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: 16, color: 'white', fontWeight: 'bold' }}>{orderItem.requestable.name}</Text>
                                    {
                                      orderItem.status == 1 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: `#FFFFFF11` }}>New</Text> : (
                                        orderItem.status == 2 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: '#FFFFFF33' }}>Awaiting account approval</Text> : (
                                          orderItem.status == 3 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: '#FFFFFF55' }}>Ordered</Text> : (
                                            orderItem.status == 4 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: '#FFFFFF77' }}>Being prepared</Text> : (
                                              orderItem.status == 5 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: '#FFFFFF99' }}>Ready to be taken</Text> : (
                                                orderItem.status == 6 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: '#FFFFFFBB' }}>Being delivered</Text> : (
                                                  orderItem.status == 7 ? <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: 'white' }}>Delivered</Text> : (
                                                    <Text style={{ flex: 1, textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: 'lightgray' }}>Unknown</Text>)))))))
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
    </SafeAreaView >
  );
};

export default ClientTableOrdersScreen;