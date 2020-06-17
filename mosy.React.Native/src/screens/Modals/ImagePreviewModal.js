import React, { useState, useContext, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { Dimensions, Image, ImageBackground, Linking, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import Modal from 'react-native-modal';

const screenWidth = Math.round(Dimensions.get('window').width);

const ImagePreviewModal = forwardRef(({ isVisible, onModalResult, onModalError }, forwardedRef) => {
  const [isModalVisible, setIsModalVisible] = useState(isVisible);
  const [imageContent, setImageContent] = useState(null);

  useImperativeHandle(forwardedRef, () => ({
    toggleVisible: (imageMeta) => {
      if (!isModalVisible && imageMeta)
        setImageContent(`data:${imageMeta.contentType};base64,${imageMeta.base64x300}`);
      setIsModalVisible(!isModalVisible);
    },
  }));

  const handleGoBack = () => { setIsModalVisible(false); };

  return (
    <Modal style={{ flex: 1, margin: 0 }} ref={forwardedRef} isVisible={isModalVisible}>
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {imageContent ? <Image style={styles.cardImage} source={{ uri: imageContent }} /> : null}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 25 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={handleGoBack}>
              <Text style={{ textAlign: 'center', color: 'white' }}>Back</Text>
            </TouchableOpacity>
          </View>
          {/* {
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity onPress={handleGo}>
                <Text style={{ textAlign: 'center', color: '#90002D', fontWeight: 'bold' }}>Go!</Text>
              </TouchableOpacity>
            </View>
        } */}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  cardImage: { height: screenWidth, width: screenWidth, },
});

export default ImagePreviewModal;