import React, { useState, useContext, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { Image, ImageBackground, Linking, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import Modal from 'react-native-modal';


const OrderModal = forwardRef(({ isVisible, onModalResult, onModalError }, forwardedRef) => {
  const [isModalVisible, setIsModalVisible] = useState(isVisible);

  const [isPreorderSelected, setIsPreorderSelected] = useState(false);
  const [isTableOrderSelected, setIsTableOrderSelected] = useState(false);
  const [isForHomeSelected, setIsForHomeSelected] = useState(false);

  const [isTakeAwaySelected, setIsTakeAwaySelected] = useState(false);
  const [isInPlaceSelected, setIsInPlaceSelected] = useState(true);

  useImperativeHandle(forwardedRef, () => ({
    toggleVisible: () => {
      setIsModalVisible(!isModalVisible);
    },
  }));

  const handleSetIsPreorderSelected = () => {
    setIsPreorderSelected(true);
    setIsTableOrderSelected(false);
    setIsForHomeSelected(false);
  };

  const handleSetIsTableOrderSelected = () => {
    setIsPreorderSelected(false);
    setIsTableOrderSelected(true);
    setIsForHomeSelected(false);
  };

  const handleSetIsForHomeOrderSelected = () => {
    setIsPreorderSelected(false);
    setIsTableOrderSelected(false);
    setIsForHomeSelected(true);
  };

  const handleSetIsTakeAwaySelected = () => {
    setIsTakeAwaySelected(true);
    setIsInPlaceSelected(false);
  };

  const handleSetIsInPlaceSelected = () => {
    setIsTakeAwaySelected(false);
    setIsInPlaceSelected(true);
  };

  const handleGo = () => {
    if (onModalResult)
      onModalResult(
        isPreorderSelected,
        isTableOrderSelected,
        isForHomeSelected,
        isTakeAwaySelected,
        isInPlaceSelected
      );
    setIsModalVisible(false);
  };


  return (
    <Modal ref={forwardedRef} isVisible={isModalVisible}>
      <View style={{ backgroundColor: 'white', padding: 15 }}>
        <Text style={{ color: '#90002D' }} h4>Nice! You are about to make an order...</Text>
        <Text style={{ marginTop: 30 }}>What type of account would you like to open?</Text>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: isPreorderSelected ? '#90002D' : 'white',
                padding: 10,
                borderColor: '#90002D',
                borderWidth: 1
              }}
              onPress={handleSetIsPreorderSelected}>
              <Text style={{
                color: isPreorderSelected ? 'white' : '#90002D',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>Preorder</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: isTableOrderSelected ? '#90002D' : 'white',
                padding: 10,
                borderColor: '#90002D',
                borderWidth: 1,
                borderLeftWidth: 0
              }}
              onPress={handleSetIsTableOrderSelected}>
              <Text style={{
                color: isTableOrderSelected ? 'white' : '#90002D',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>Be seated</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
            <TouchableOpacity style={{ padding: 10, borderColor: '#90002D', borderWidth: 1, borderLeftWidth: 0 }}>
              <Text style={{ textAlign: 'center', color: '#90002D', fontWeight: 'bold' }}>For home</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {
          isPreorderSelected || isTableOrderSelected || isForHomeSelected
            ? <Text style={{ marginTop: 15 }}>Whеre do you prefer to enjoy it?</Text>
            : null
        }

        {
          isPreorderSelected || isTableOrderSelected || isForHomeSelected
            ? (
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: isInPlaceSelected ? '#90002D' : 'white',
                      padding: 10,
                      borderColor: '#90002D',
                      borderWidth: 1
                    }}
                    onPress={handleSetIsInPlaceSelected}>
                    <Text style={{
                      color: isInPlaceSelected ? 'white' : '#90002D',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>In place</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: isTakeAwaySelected ? '#90002D' : 'white',
                      padding: 10,
                      borderColor: '#90002D',
                      borderWidth: 1,
                      borderLeftWidth: 0
                    }}
                    onPress={handleSetIsTakeAwaySelected}>
                    <Text style={{
                      color: isTakeAwaySelected ? 'white' : '#90002D',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>Will take it away</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
            : null
        }

        <View style={{ flexDirection: 'row', marginTop: 25 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={{ textAlign: 'center', color: '#90002D' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {
            (isPreorderSelected || isTableOrderSelected || isForHomeSelected)
              && (isTakeAwaySelected || isInPlaceSelected)
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

export default OrderModal;