import React, { useState, useContext, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { Image, ImageBackground, Linking, RefreshControl, ScrollView, Share, StyleSheet, TouchableOpacity, View, InteractionManager } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import { venueTablesService } from '../../services/venueTablesService';


const SelectTableModal = forwardRef(({ venueId, isVisible, onModalResult, onForbiddenError }, forwardedRef) => {
  const [isModalVisible, setIsModalVisible] = useState(isVisible);

  const [isTablesLoading, setIsTablesLoading] = useState(false);
  const [freeTables, setFreeTables] = useState(null);

  const [selectedTable, setSelectedTable] = useState(null);


  useImperativeHandle(forwardedRef, () => ({
    toggleVisible: () => {
      setIsModalVisible(!isModalVisible);
    },
  }));

  const handleLoadTables = async () => {
    setIsTablesLoading(true);
    const tablesResult = await venueTablesService
      .loadUntakenTables(venueId)
      .catch((err) => {
        if (err && err.response && err.response.status == 403) {
          onForbiddenError();
          setIsModalVisible(false);
        }
      });

    setIsTablesLoading(false);
    if (tablesResult) setFreeTables(tablesResult);
  };

  const handleTableSelection = (table) => {
    setSelectedTable(table);
  };

  const handleGo = () => {
    if (onModalResult)
      onModalResult(selectedTable);
    setIsModalVisible(false);
  };

  useEffect(() => {
    async function init() {
      if (isModalVisible)
        await handleLoadTables();
    }
    init();
  }, [isModalVisible]);

  return (
    <Modal ref={forwardedRef} isVisible={isModalVisible}>
      <View style={{ backgroundColor: 'white', padding: 15 }}>
        {
          isTablesLoading
            ? <React.Fragment>
              <Text style={{ color: '#90002D' }} h4>Looking for free places...</Text>
            </React.Fragment>
            : null
        }

        {
          freeTables && freeTables.length
            ? <React.Fragment>
              <Text style={{ color: '#90002D' }} h4>Here are the tables that are still unoccupied...</Text>
              <Text style={{ marginTop: 30 }}>Please select a table where you will be seated:</Text>
            </React.Fragment>
            : null
        }

        <View style={{ flexDirection: 'row', marginTop: 5, height: 250 }}>
          {
            setIsTablesLoading
              ?
              <FlatList
                scrollEnabled
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                data={freeTables}
                renderItem={(tableProps) => {
                  const table = tableProps.item;
                  return (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        margin: 3,
                        backgroundColor: selectedTable && selectedTable.id == table.id ? '#90002D' : 'lightgray',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        borderRadius: 3
                      }}>
                      <TouchableOpacity onPress={() => handleTableSelection(table)}>
                        {/* <View style={{ paddingTop: 4, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                      {table.name ? <Text style={{ textAlign: 'center', fontWeight: 'bold', color: selectedTable && selectedTable.id == table.id ? 'white' : '#90002D' }}>{table.name}</Text> : null}
                    </View> */}
                        <View style={{ paddingBottom: 2, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ textAlign: 'center', color: selectedTable && selectedTable.id == table.id ? 'white' : '#90002D' }}>{table.defaultSeatsCount} seats</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                refreshControl={<RefreshControl refreshing={isTablesLoading} onRefresh={handleLoadTables} />}
                ListEmptyComponent={
                  <View style={{ height: 250, justifyContent: "center" }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#90002D' }}>Please excuse us! Our venue is full at this time. We will be glad to welcome you a bit later!</Text>
                  </View>
                }
                scrollEnabled={true}
                style={{ flex: 1 }} />
              : null
          }
        </View>
        <View style={{ flexDirection: 'row', marginTop: 25 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={{ textAlign: 'center', color: '#90002D' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {
            selectedTable
              ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity onPress={handleGo}>
                    <Text style={{ textAlign: 'center', color: '#90002D', fontWeight: 'bold' }}>Go!</Text>
                  </TouchableOpacity>
                </View>
              )
              : null
          }
        </View>

      </View>
    </Modal>
  );
});

export default SelectTableModal;