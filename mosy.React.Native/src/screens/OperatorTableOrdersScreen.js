import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountOperatorContext } from '../context/TableAccountOperatorContext';
import { accountOperatorService } from '../services/websockets/accountOperatorService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import Spacer from '../components/Spacer';


const OperatorTableOrdersScreen = ({ navigation }) => {
  const tableAccount = navigation.state.params.tableAccount;
  const bgColorTiles = `#${tableAccount.id.substring(0, 6)}DD`;

  const userContext = useContext(UserContext);
  const operatedVenue = userContext.state.selectedOperationalVenue;
  const tableAccountOperatorContext = useContext(TableAccountOperatorContext);
  const { loadOrders, setOrderItem } = tableAccountOperatorContext;
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLoadOrders = async () => {
    setOrdersLoading(true);
    await loadOrders(tableAccount.id).catch(e => e.response);
    setOrdersLoading(false);
  };


  // ORDERS HUB
  const handleOrderItemStatusChanged = (result) => {
    console.log('Operator - OrderItemStatusChanged');
    // console.log(result);

    setOrderItem(result);
  };
  const handleOrdersHubSubscriptions = () => {
    const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
    if (ordersHubConnection) {
      ordersHubConnection.on('OrderItemStatusChanged', handleOrderItemStatusChanged);
      accountOperatorService.invokeOrdersHubConnectedAsAccountOperator(operatedVenue.id);
    }
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
      {
        ordersLoading
          ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#90002D" />
            </View>
          )
          : (
            tableAccountOperatorContext.state.tableAccountOrders && tableAccountOperatorContext.state.tableAccountOrders.length
              ? (
                <FlatList
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  data={tableAccountOperatorContext.state.tableAccountOrders}
                  renderItem={(orderProps) => {
                    const order = orderProps.item;
                    return (
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 20,
                          flexDirection: 'column',
                          marginHorizontal: 8,
                          marginVertical: 4,
                          backgroundColor: bgColorTiles, // 'lightgray'
                          justifyContent: 'center',
                          alignItems: 'stretch',
                        }}>
                        <TouchableOpacity onPress={() => navigation.navigate("OperatorTableOrders")}>
                          <View style={{ height: '100%', padding: 16 }}>

                            <FlatList
                              keyExtractor={(item, index) => index.toString()}
                              data={order.orderRequestables}
                              renderItem={(orderItemProps) => {
                                const orderItem = orderItemProps.item;
                                return (
                                  <View style={{ marginVertical: 2, flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: 16, color: 'white', fontWeight: 'bold' }}>{(orderItem.requestable.name)}</Text>
                                    {
                                      orderItem.status == 1 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF11' }}>New</Text> : (
                                        orderItem.status == 2 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF33' }}>Awaiting account approval</Text> : (
                                          orderItem.status == 3 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF55' }}>Received</Text> : (
                                            orderItem.status == 4 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF77' }}>Being prepared</Text> : (
                                              orderItem.status == 5 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF99' }}>Ready to be taken</Text> : (
                                                orderItem.status == 6 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFFBB' }}>Being delivered</Text> : (
                                                  orderItem.status == 7 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Delivered</Text> : (
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'lightgray' }}>Unknown</Text>)))))))
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

export default OperatorTableOrdersScreen;