import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';

import { dishesService } from '../../services/dishesService';
import { Context as TableAccountCustomerContext } from '../../context/TableAccountCustomerContext';


const NewOrderMenuItem = ({ selectedCulture }) => {
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  // const { addNewOrderItem, removeNewOrderItem } = tableAccountCustomerContext;

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(
    () => {
      async function init() {

      }
      init();
    }, []);


  return (
    <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={{ minHeight: 40, alignItems: 'center', flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4d0018' }}>
          <Text style={{ color: "#991a42" }}>
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