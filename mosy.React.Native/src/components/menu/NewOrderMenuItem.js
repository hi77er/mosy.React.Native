import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

import { Context as UserContext } from '../../context/UserContext';
import { Context as TableAccountCustomerContext } from '../../context/TableAccountCustomerContext';
import { accountOpenerService } from '../../services/websockets/accountOpenerService';



const NewOrderMenuItem = ({ selectedCulture }) => {
  const userContext = useContext(UserContext);
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { addNewOrderItem, removeNewOrderItem } = tableAccountCustomerContext;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddItem = (item) => {
    addNewOrderItem(item);
  };

  const handleRemoveItem = (itemId) => {
    removeNewOrderItem(itemId);
  };

  const handleNewOrder = () => {
    if (!tableAccountCustomerContext.state.tableAccount) {
      const bindingModel = {
        openerUsername: userContext.state.user.username,
        assignedOperatorUsername: tableAccountCustomerContext.state.tableAccount && tableAccountCustomerContext.state.tableAccount.assignedOperatorUsername
          ? tableAccountCustomerContext.state.tableAccount.assignedOperatorUsername
          : null,
        fboTableId: tableAccountCustomerContext.state.tableAccount && tableAccountCustomerContext.state.tableAccount.fboTable
          ? tableAccountCustomerContext.state.tableAccount.fboTable.id
          : (tableAccountCustomerContext.state.newlySelectedTable ? tableAccountCustomerContext.state.newlySelectedTable.id : null),
        requestableIds: tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
          ? tableAccountCustomerContext.state.newlySelectedItems.map((x) => x.id)
          : []
      };

      accountOpenerService.invokeCreateTableAccountRequest(bindingModel);
    }
    else {
      const bindingModel = {
        creatorUsername: userContext.state.user.username,
        tableAccountId: tableAccountCustomerContext.state.tableAccount
          ? tableAccountCustomerContext.state.tableAccount.id
          : null,
        requestableIds: tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
          ? tableAccountCustomerContext.state.newlySelectedItems.map((x) => x.id)
          : []
      };
      accountOpenerService.invokeCreateOrderRequest(bindingModel);
    }
  };

  useEffect(
    () => {
      async function init() {

      }
      init();
    }, []);

  const getItemsGroups = () => {
    return tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
      ? tableAccountCustomerContext
        .state
        .newlySelectedItems
        .reduce((resultGroups, item) => {
          const key = item.id;

          resultGroups[key] = resultGroups[key] || [];
          resultGroups[key].push(item);

          return resultGroups;
        }, {})
      : null
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleLabel}>
            New order (
              <Text
              style={
                tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
                  ? styles.headerCountLabel
                  : null
              }>
              {
                tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length
                  ? `${tableAccountCustomerContext.state.newlySelectedItems.length} items`
                  : 'Nothing selected'
              }
            </Text>
            )
            </Text>
          {
            //tableAccountCustomerContext.state.tableAccount
            //&& 
            tableAccountCustomerContext.state.newlySelectedItems
              && tableAccountCustomerContext.state.newlySelectedItems.length
              ? <TouchableOpacity style={styles.sendButton} onPress={handleNewOrder}>
                <View style={styles.sendButtonContainer}>
                  <Text style={styles.sendButtonLabel}>SEND</Text>
                </View>
              </TouchableOpacity>
              : null
          }
        </View>
      </TouchableOpacity>

      {
        isExpanded
          ? (
            <View style={styles.expandContainer}>
              <Text style={styles.tableLabelOuter}>
                <Text style={styles.tableLabelInner}>Table:</Text> {
                  tableAccountCustomerContext.state.tableAccount && tableAccountCustomerContext.state.tableAccount.fboTable
                    ? `${(tableAccountCustomerContext.state.tableAccount.fboTable.name || tableAccountCustomerContext.state.tableAccount.fboTable.id.substring(0, 8))}, ${tableAccountCustomerContext.state.tableAccount.fboTable.defaultSeatsCount} seats`
                    : (tableAccountCustomerContext.state.newlySelectedTable || 'Not selected')
                }
              </Text>
              <Text style={styles.waiterLabelOuter}>
                <Text style={styles.waiterLabelInner}>Your waiter:</Text> {
                  tableAccountCustomerContext.state.tableAccount && tableAccountCustomerContext.state.tableAccount.assignedOperatorUsername
                    ? tableAccountCustomerContext.state.tableAccount.assignedOperatorUsername
                    : 'Any moment will be appointed.'
                }
              </Text>

              {
                getItemsGroups()
                  ? (
                    <ScrollView style={styles.itemsScrollContainer}>
                      {
                        Object
                          .keys(
                            tableAccountCustomerContext
                              .state
                              .newlySelectedItems
                              .reduce((resultGroups, item) => {
                                const key = item.id;

                                resultGroups[key] = resultGroups[key] || [];
                                resultGroups[key].push(item.id);

                                return resultGroups;
                              }, {})
                          )
                          .map((itemsGroupKey) => {
                            return (
                              <View key={itemsGroupKey} style={styles.groupItemContainer}>
                                <Text style={styles.countLabel}>{getItemsGroups()[itemsGroupKey].length} x </Text>
                                <Text style={styles.itemNameLabel}>{getItemsGroups()[itemsGroupKey][0].name}</Text>
                                <Text style={styles.itemPriceLabel}>{getItemsGroups()[itemsGroupKey][0].priceDisplayText}</Text>
                                <View style={styles.actionsContainer}>
                                  <TouchableOpacity style={styles.preLastAction} onPress={() => handleAddItem(getItemsGroups()[itemsGroupKey][0])}>
                                    <OcticonsIcon name="diff-added" color="#991a42" size={30} />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => handleRemoveItem(getItemsGroups()[itemsGroupKey][0].id)}>
                                    <OcticonsIcon name="diff-removed" color="#991a42" size={30} />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          })
                      }
                    </ScrollView>
                  )
                  : <Text style={styles.noItemsLabel}>We are looking forward to receiving your order.</Text>
              }
            </View>
          )
          : null
      }
    </View >
  );
};

const styles = StyleSheet.create({
  itemContainer: { paddingHorizontal: 4, paddingVertical: 2 },
  headerContainer: { width: "100%", minHeight: 40, alignItems: 'center', flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4d0018' },
  headerCountLabel: { color: 'white', fontWeight: 'bold' },
  titleLabel: { flex: 5, color: "#991a42" },
  sendButton: { alignSelf: "flex-end" },
  sendButtonContainer: { width: 50, height: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "white", borderRadius: 6, backgroundColor: '#60a860' },
  sendButtonLabel: { color: "white", fontSize: 10, fontWeight: "bold" },
  expandContainer: { paddingHorizontal: 10, paddingBottom: 5, backgroundColor: '#4d0018' },
  tableLabelOuter: { color: 'lightgray', marginBottom: 0 },
  tableLabelInner: { color: '#991a42' },
  waiterLabelOuter: { color: 'lightgray', marginBottom: 0 },
  waiterLabelInner: { color: '#991a42', marginBottom: 0 },
  itemsScrollContainer: { maxHeight: 80, marginTop: 8 },
  groupItemContainer: { flexDirection: 'row', marginBottom: 5, alignItems: 'center' },
  countLabel: { flex: 1, fontWeight: 'bold', color: 'white' },
  itemNameLabel: { flex: 5, fontWeight: 'bold', color: 'white' },
  itemPriceLabel: { flex: 2, textAlign: 'center', color: 'white' },
  actionsContainer: { flex: 2, flexDirection: 'row', textAlign: 'center', color: 'white', justifyContent: 'flex-end' },
  preLastAction: { marginEnd: 7 },
  noItemsLabel: { color: '#991a42', marginBottom: 5 },
});


export default NewOrderMenuItem;