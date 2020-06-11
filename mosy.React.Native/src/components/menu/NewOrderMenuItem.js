import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';

import { Context as UserContext } from '../../context/UserContext';
import { Context as TableAccountCustomerContext } from '../../context/TableAccountCustomerContext';
import { accountOpenerService } from '../../services/websockets/accountOpenerService';



const NewOrderMenuItem = ({ selectedCulture }) => {
  const userContext = useContext(UserContext);
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  // const { addNewOrderItem, removeNewOrderItem } = tableAccountCustomerContext;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleNewOrder = () => {
    const bindingModel = {
      openerUsername: userContext.state.user.username,
      assignedOperatorUsername: tableAccountCustomerContext.state.assignedOperator,
      fboTableId: tableAccountCustomerContext.state.selectedTable.id,
      requestableIds: tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
        ? tableAccountCustomerContext.state.newlySelectedItems.map((x) => x.id)
        : []
    };
    accountOpenerService.invokeCreateTableAccountRequest(bindingModel);
  };

  useEffect(
    () => {
      async function init() {

      }
      init();
    }, []);


  return (
    <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
      {/* {
        console.log(
          tableAccountCustomerContext.state.newlySelectedItems
            .reduce(
              (resultGroups, menuItem) => {
                if (!resultGroups.filter(x => x.key == menuItem.id).length)
                  resultGroups = [...resultGroups, { key: menuItem.id, value: { ...menuItem, count: 0 } }];

                resultGroups = resultGroups.map(g => {
                  if (g.key == menuItem.id)
                    g.value = { ...g.value, count: g.value.count++ };

                  return g;
                });

                return resultGroups;
              },
              []
            )
        ).map(x => { x.key, x.value.count })
      } */}
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={{ width: "100%", minHeight: 40, alignItems: 'center', flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4d0018' }}>
          <Text style={{ flex: 5, color: "#991a42" }}>
            Your current order (
              <Text
              style={
                tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
                  ? { color: 'white', fontWeight: 'bold' }
                  : {}
              }>
              {tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
                ? `${tableAccountCustomerContext.state.newlySelectedItems.length} items`
                : 'Nothing selected'}
            </Text>
            )
            </Text>
          {
            //tableAccountCustomerContext.state.tableAccount
            //&& 
            tableAccountCustomerContext.state.newlySelectedItems
              && tableAccountCustomerContext.state.newlySelectedItems.length
              ? <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={handleNewOrder}>
                <View style={{ width: 50, height: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "white", borderRadius: 6, backgroundColor: '#60a860' }}>
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>ORDER</Text>
                </View>
              </TouchableOpacity>
              : null
          }
        </View>
      </TouchableOpacity>

      {
        isExpanded
          ? (
            <View style={{ paddingHorizontal: 10, paddingBottom: 5, backgroundColor: '#4d0018' }}>
              <Text style={{ color: 'lightgray', marginBottom: 0 }}>
                <Text style={{ color: '#991a42' }}>Table:</Text> {
                  tableAccountCustomerContext.state.selectedTable
                    ? `${(tableAccountCustomerContext.state.selectedTable.name || tableAccountCustomerContext.state.selectedTable.id.substring(0, 8))}, ${tableAccountCustomerContext.state.selectedTable.defaultSeatsCount} seats`
                    : 'Not selected'
                }
              </Text>
              <Text style={{ color: 'lightgray', marginBottom: 0 }}>
                <Text style={{ color: '#991a42' }}>Your waiter:</Text> {
                  tableAccountCustomerContext.state.assignedOperator
                    ? (
                      `${tableAccountCustomerContext.state.assignedOperator.firstName} ${tableAccountCustomerContext.state.assignedOperator.firstName}`.trim()
                      || tableAccountCustomerContext.state.assignedOperator.username
                    )
                    : 'Any moment will be appointed.'
                }
              </Text>

              {
                tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
                  ? (
                    <ScrollView style={{ maxHeight: 80, marginTop: 8 }}>
                      {
                        tableAccountCustomerContext
                          .state
                          .newlySelectedItems
                          .map((item, index) =>
                            (
                              <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={{ flex: 5, fontWeight: 'bold', color: 'white' }}>{item.name}</Text>
                                <Text style={{ flex: 2, textAlign: 'center', color: 'white' }}>{item.priceDisplayText}</Text>
                                <Text style={{ flex: 1, textAlign: 'right', color: 'white' }}>X</Text>
                              </View>
                            )
                          )
                      }
                    </ScrollView>
                  )
                  : <Text style={{ color: '#991a42', marginBottom: 5 }}>We are looking forward to receiving your order.</Text>
              }
            </View>
          )
          : null
      }
    </View >
  );
};


const styles = StyleSheet.create({
  itemImage: {
    width: 100,
    height: 100,
    marginEnd: 5,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    backgroundColor: "#fbeaef"
  },
});


export default NewOrderMenuItem;