import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as UserContext } from '../context/UserContext';
import { Context as TableAccountOperatorContext } from '../context/TableAccountOperatorContext';

import Spacer from '../components/Spacer';


const ClientTableOrdersScreen = ({ navigation }) => {
  const tableAccount = navigation.state.params.tableAccount;
  const userContext = useContext(UserContext);
  const tableAccountOperatorContext = useContext(TableAccountOperatorContext);
  const { loadOrders } = tableAccountOperatorContext;
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLoadOrders = async () => {
    setOrdersLoading(true);
    await loadOrders(tableAccount.id).catch(e => e.response);
    setOrdersLoading(false);
  };

  useEffect(() => {
    async function init() {
      await handleLoadOrders();
    }
    init();
  }, []);

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text h4>Orders</Text>
        <Text h5>{tableAccount.id.substring(0, 8)}</Text>
      </Spacer>
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
                              data={order.orderRequestables}
                              renderItem={(orderItemProps) => {
                                const orderItem = orderItemProps.item;
                                return (
                                  <View style={{ margin: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{orderItem.requestable.name}</Text>
                                    {
                                      orderItem.status == 1 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>New</Text> : (
                                        orderItem.status == 2 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Awaiting account approval</Text> : (
                                          orderItem.status == 3 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Received</Text> : (
                                            orderItem.status == 4 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'yellow' }}>Being prepared</Text> : (
                                              orderItem.status == 5 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>Ready to be taken</Text> : (
                                                orderItem.status == 6 ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'darkgreen' }}>Delivered</Text>
                                                  : <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Unknown</Text>)))))
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